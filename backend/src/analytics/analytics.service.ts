import { Injectable } from '@nestjs/common';
import { StockStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateRedistributionDto } from './dto/redistribution.dto';

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

  redistribution() {
    return this.prisma.redistributionRec.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /** Schedule an inter-regional transfer and anchor it on-chain. */
  async scheduleRedistribution(dto: CreateRedistributionDto) {
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
