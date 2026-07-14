import { Injectable, NotFoundException } from '@nestjs/common';
import { RfqStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { scoreSupplierMatch } from '../common/utils/match-score';
import { AwardRfqDto, CreateQuoteDto, CreateRfqDto, UpdateRfqDto } from './dto/rfq.dto';

@Injectable()
export class RfqService {
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
            { buyer: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.rfq, q, { where, orderBy: { createdAt: 'desc' }, include: { quotes: true } });
  }

  /** RFQ with quotes ranked by the AI match score. */
  async findOne(id: string) {
    const rfq = await this.prisma.rfq.findUnique({ where: { id }, include: { quotes: true } });
    if (!rfq) throw new NotFoundException('RFQ tidak ditemukan');
    const ranked = rfq.quotes
      .map((qt) => {
        const { score, reasons } = scoreSupplierMatch({
          priceIndex: qt.priceIndex,
          distanceKm: qt.jarakKm,
          rating: qt.rating,
          leadTimeDays: qt.leadTimeDays,
          reliability: qt.reliability,
        });
        return { ...qt, matchScore: score, matchReasons: reasons };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
    return { ...rfq, quotes: ranked };
  }

  async create(dto: CreateRfqDto) {
    const kode = dto.kode ?? `RFQ-${Date.now().toString().slice(-6)}`;
    const rfq = await this.prisma.rfq.create({ data: { ...dto, kode } });
    await this.blockchain.anchor({
      contract: 'ProcurementRFQ',
      method: 'createRFQ',
      summary: `${rfq.kode} — ${rfq.komoditas} (${rfq.qty} ${rfq.satuan})`,
    });
    return rfq;
  }

  async update(id: string, dto: UpdateRfqDto) {
    await this.ensure(id);
    return this.prisma.rfq.update({ where: { id }, data: dto });
  }

  async addQuote(id: string, dto: CreateQuoteDto) {
    await this.ensure(id);
    const quote = await this.prisma.quote.create({ data: { ...dto, rfqId: id } });
    await this.blockchain.anchor({
      contract: 'ProcurementRFQ',
      method: 'submitQuote',
      summary: `Penawaran ${dto.supplier} untuk RFQ ${id}`,
    });
    return quote;
  }

  async award(id: string, dto: AwardRfqDto) {
    const rfq = await this.ensure(id);
    const updated = await this.prisma.rfq.update({
      where: { id },
      data: { status: RfqStatus.DIPUTUSKAN, awardedTo: dto.supplier },
    });
    await this.blockchain.anchor({
      contract: 'ProcurementRFQ',
      method: 'awardQuote',
      summary: `${rfq.kode} dimenangkan ${dto.supplier}`,
      actor: dto.supplier,
    });
    return updated;
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.rfq.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const rfq = await this.prisma.rfq.findUnique({ where: { id } });
    if (!rfq) throw new NotFoundException('RFQ tidak ditemukan');
    return rfq;
  }
}
