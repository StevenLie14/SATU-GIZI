import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { scoreSupplierMatch } from '../common/utils/match-score';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto/purchase-order.dto';

// rough distance heuristic by region (km from Jakarta hub)
const DISTANCE: Record<string, number> = {
  'Jakarta Pusat': 4,
  'Jakarta Selatan': 6,
  'Jakarta Utara': 9,
  'Jakarta Barat': 8,
  'Jakarta Timur': 10,
  Bogor: 55,
  Bandung: 120,
};

@Injectable()
export class ProcurementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
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
   * AI supplier matching for a commodity — ranks verified suppliers by the
   * weighted match score (price, distance, rating, lead time).
   */
  async matchSuppliers(komoditas: string) {
    const suppliers = await this.prisma.supplier.findMany({
      where: { komoditas: { has: komoditas } },
    });
    return suppliers
      .map((s) => {
        const leadTimeDays = parseInt(s.leadTime ?? '1', 10) || 1;
        const distanceKm = DISTANCE[s.lokasi] ?? 30;
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
          skor: score,
          alasan: reasons.join(' · '),
        };
      })
      .sort((a, b) => b.skor - a.skor);
  }
}
