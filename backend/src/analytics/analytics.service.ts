import { BadRequestException, Injectable } from '@nestjs/common';
import { StockStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { haversineKm, regionCentroid, round1 } from '../common/utils/geo';
import { GeoRulesService } from '../geo-rules/geo-rules.service';
import { CreateRedistributionDto } from './dto/redistribution.dto';

// Heuristik penghematan logistik: Rp 15 per kg-km (angka demo)
const SAVING_PER_KG_KM = 15;

/** Linear-trend forecast (simple regression). */
function forecastNext(series: number[], periods: number): number[] {
  const clean = series.filter((v) => v > 0);
  const n = clean.length;
  if (n < 2) return Array(periods).fill(clean[0] ?? 0);
  const xs = clean.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = clean.reduce((a, b) => a + b, 0) / n;
  const slope =
    xs.reduce((acc, x, i) => acc + (x - meanX) * (clean[i] - meanY), 0) /
    xs.reduce((acc, x) => acc + (x - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  return Array.from({ length: periods }, (_, k) => Math.round(intercept + slope * (n + k)));
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
    private readonly geoRules: GeoRulesService,
  ) {}

  /** National dashboard KPIs aggregated across domains. */
  async dashboard() {
    const [porsiAgg, schools, kitchens, suppliers, criticalStock, reviews, batchesActive] =
      await Promise.all([
        this.prisma.distributionBatch.aggregate({ _sum: { porsi: true } }),
        this.prisma.school.count(),
        this.prisma.kitchen.count(),
        this.prisma.supplier.count(),
        this.prisma.stockItem.count({ where: { status: StockStatus.KRITIS } }),
        this.prisma.review.findMany({ select: { rating: true } }),
        this.prisma.distributionBatch.count({ where: { NOT: { stage: 'SELESAI' } } }),
      ]);
    const avgRating = reviews.length
      ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10
      : 0;
    return {
      porsiTerdistribusi: porsiAgg._sum.porsi ?? 0,
      sekolah: schools,
      dapur: kitchens,
      supplier: suppliers,
      stokKritis: criticalStock,
      batchAktif: batchesActive,
      kepuasan: avgRating,
    };
  }

  /** 7-day demand actuals + AI prediction. */
  demandForecast() {
    const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const actual = [11200, 11500, 11300, 11800, 12100, 0, 0];
    const predicted = [...actual.filter((v) => v > 0), ...forecastNext(actual, 2)];
    return { labels, actual, predicted, accuracy: 93 };
  }

  /** Commodity price prediction (illustrative). */
  priceForecast() {
    return [
      { komoditas: 'Beras', current: 13500, next: 13800, trend: 'naik', conf: 88 },
      { komoditas: 'Daging Ayam', current: 38000, next: 36500, trend: 'turun', conf: 82 },
      { komoditas: 'Telur Ayam', current: 29000, next: 30500, trend: 'naik', conf: 79 },
      { komoditas: 'Sayur Campuran', current: 12000, next: 12000, trend: 'stabil', conf: 91 },
      { komoditas: 'Minyak Goreng', current: 16000, next: 16800, trend: 'naik', conf: 85 },
    ];
  }

  regionBalance() {
    return this.prisma.regionBalance.findMany({ orderBy: { surplus: 'desc' } });
  }

  /**
   * Rekomendasi redistribusi — diturunkan dari surplus/defisit RegionBalance,
   * hanya memasangkan wilayah dalam radius aturan REDISTRIBUTION (centroid
   * haversine). Baris yang sudah dijadwalkan/di-anchor tetap ditampilkan.
   */
  async redistribution() {
    const [rule, balances, scheduled] = await Promise.all([
      this.geoRules.getRule('REDISTRIBUTION'),
      this.prisma.regionBalance.findMany(),
      this.prisma.redistributionRec.findMany({
        where: { NOT: { status: 'Direkomendasikan' } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const derived: Array<Record<string, unknown>> = [];
    const byKomoditas = new Map<string, typeof balances>();
    for (const b of balances) {
      const list = byKomoditas.get(b.komoditas) ?? [];
      list.push(b);
      byKomoditas.set(b.komoditas, list);
    }

    for (const [komoditas, rows] of byKomoditas) {
      const deficits = rows.filter((r) => r.surplus < 0);
      const surpluses = rows
        .filter((r) => r.surplus > 0)
        .map((r) => ({ region: r.region, remaining: r.surplus }));

      for (const deficit of deficits) {
        const toCentroid = regionCentroid(deficit.region);
        if (!toCentroid) continue;
        let need = Math.abs(deficit.surplus);

        const candidates = surpluses
          .map((s) => {
            const fromCentroid = regionCentroid(s.region);
            return fromCentroid
              ? { ...s, km: round1(haversineKm(fromCentroid, toCentroid)) }
              : null;
          })
          .filter((c): c is { region: string; remaining: number; km: number } => !!c)
          .filter((c) => !rule.active || c.km <= rule.radiusKm)
          .sort((a, b) => a.km - b.km);

        for (const c of candidates) {
          if (need <= 0 || c.remaining <= 0) continue;
          const jumlah = Math.min(need, c.remaining);
          const src = surpluses.find((s) => s.region === c.region);
          if (src) src.remaining -= jumlah;
          need -= jumlah;
          const hematJt = (jumlah * c.km * SAVING_PER_KG_KM) / 1_000_000;
          derived.push({
            id: `rec-${c.region}-${deficit.region}-${komoditas}`.replace(/\s+/g, '-').toLowerCase(),
            fromRegion: c.region,
            toRegion: deficit.region,
            komoditas,
            jumlah,
            satuan: 'kg',
            jarak: `${Math.round(c.km)} km`,
            hemat: `Rp ${hematJt.toFixed(1).replace('.', ',')} jt`,
            status: 'Direkomendasikan',
            txHash: null,
            createdAt: new Date(),
          });
        }
      }
    }

    return [...scheduled, ...derived];
  }

  /** Schedule an inter-regional transfer and anchor it on-chain. */
  async scheduleRedistribution(dto: CreateRedistributionDto) {
    const rule = await this.geoRules.getRule('REDISTRIBUTION');
    const from = regionCentroid(dto.fromRegion);
    const to = regionCentroid(dto.toRegion);
    if (rule.active && from && to) {
      const km = round1(haversineKm(from, to));
      if (km > rule.radiusKm) {
        throw new BadRequestException(
          `Jarak ${dto.fromRegion} → ${dto.toRegion} (${km} km) melebihi radius aturan redistribusi (${rule.radiusKm} km)`,
        );
      }
    }
    const anchor = await this.blockchain.anchor({
      contract: 'RedistributionLedger',
      method: 'proposeTransfer',
      summary: `${dto.komoditas} ${dto.fromRegion} → ${dto.toRegion}`,
      actor: 'Koordinator Wilayah',
      data: { jumlah: dto.jumlah, satuan: dto.satuan },
    });
    return this.prisma.redistributionRec.create({
      data: { ...dto, status: 'Dijadwalkan', txHash: anchor.txHash },
    });
  }
}
