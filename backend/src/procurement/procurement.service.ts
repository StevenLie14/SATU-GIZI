import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { scoreSupplierMatch } from '../common/utils/match-score';
import { haversineKm, regionCentroid, round1, type LatLng } from '../common/utils/geo';
import { GeoRulesService } from '../geo-rules/geo-rules.service';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto/purchase-order.dto';

// Pusat terakhir bila tidak ada dapur maupun pusat aturan (hub Jakarta)
const JAKARTA_HUB: LatLng = { lat: -6.2, lng: 106.8167 };

@Injectable()
export class ProcurementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
    private readonly geoRules: GeoRulesService,
  ) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { kode: { contains: q.search, mode: 'insensitive' } },
            { komoditas: { contains: q.search, mode: 'insensitive' } },
            { supplier: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.purchaseOrder, q, { where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!po) throw new NotFoundException('Purchase order tidak ditemukan');
    return po;
  }

  async create(dto: CreatePurchaseOrderDto) {
    const kode = dto.kode ?? `PO-${Date.now().toString().slice(-6)}`;
    const po = await this.prisma.purchaseOrder.create({ data: { ...dto, kode } });
    await this.blockchain.anchor({
      contract: 'ProcurementRFQ',
      method: 'createPO',
      summary: `${po.kode} — ${po.komoditas} (${po.qty} ${po.satuan})`,
      actor: po.supplier,
    });
    return po;
  }

  async update(id: string, dto: UpdatePurchaseOrderDto) {
    await this.findOne(id);
    return this.prisma.purchaseOrder.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.purchaseOrder.delete({ where: { id } });
  }

  /**
   * AI supplier matching for a commodity — ranks suppliers by the weighted
   * match score with real haversine distance from the requesting kitchen
   * (aturan wilayah SUPPLIER_MATCH menentukan radius dan pusat fallback).
   */
  async matchSuppliers(komoditas: string, kitchenId?: string) {
    const rule = await this.geoRules.getRule('SUPPLIER_MATCH');

    let center: LatLng | null = null;
    if (kitchenId) {
      const kitchen = await this.prisma.kitchen.findUnique({ where: { id: kitchenId } });
      if (!kitchen) throw new NotFoundException('Dapur tidak ditemukan');
      center = { lat: kitchen.latitude, lng: kitchen.longitude };
    } else if (rule.centerLat != null && rule.centerLng != null) {
      center = { lat: rule.centerLat, lng: rule.centerLng };
    } else {
      const firstKitchen = await this.prisma.kitchen.findFirst();
      center = firstKitchen
        ? { lat: firstKitchen.latitude, lng: firstKitchen.longitude }
        : JAKARTA_HUB;
    }

    const suppliers = await this.prisma.supplier.findMany({
      where: { komoditas: { has: komoditas } },
    });
    const scored = suppliers
      .map((s) => {
        const leadTimeDays = parseInt(s.leadTime ?? '1', 10) || 1;
        const coords: LatLng | null =
          s.latitude != null && s.longitude != null
            ? { lat: s.latitude, lng: s.longitude }
            : regionCentroid(s.lokasi);
        const distanceKm = coords ? round1(haversineKm(center, coords)) : 30;
        const { score, reasons } = scoreSupplierMatch({
          priceIndex: s.hargaIndex,
          distanceKm,
          rating: s.rating,
          leadTimeDays,
        });
        return {
          supplier: s.nama,
          lokasi: s.lokasi,
          hargaIndex: s.hargaIndex,
          rating: s.rating,
          leadTime: s.leadTime,
          distanceKm,
          perkiraan: !coords,
          dalamRadius: !rule.active || distanceKm <= rule.radiusKm,
          radiusKm: rule.radiusKm,
          skor: score,
          alasan: reasons.join(' · '),
        };
      })
      .sort((a, b) => b.skor - a.skor);

    // Panel kosong lebih buruk daripada saran di luar radius — fallback ke daftar penuh
    const inRadius = scored.filter((s) => s.dalamRadius);
    return inRadius.length ? inRadius : scored;
  }
}
