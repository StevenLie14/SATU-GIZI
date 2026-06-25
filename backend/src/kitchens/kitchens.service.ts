import { Injectable, NotFoundException } from '@nestjs/common';
import { PermitStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  ChecklistItemDto,
  CreateKitchenDto,
  InspectionDto,
  IssuePermitDto,
  UpdateKitchenDto,
} from './dto/kitchen.dto';

const DEFAULT_CHECKLIST = [
  'Sertifikat Laik Higiene Sanitasi (SLHS)',
  'Sertifikat Halal',
  'Pelatihan Higiene Karyawan',
  'Fasilitas Cold Storage',
  'Audit HACCP Berkala',
];

@Injectable()
export class KitchensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
  ) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { name: { contains: q.search, mode: 'insensitive' } },
            { address: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.kitchen, q, {
      where,
      orderBy: { createdAt: 'desc' },
      include: { checklist: true, _count: { select: { inspections: true, staff: true } } },
    });
  }

  async findOne(id: string) {
    const kitchen = await this.prisma.kitchen.findUnique({
      where: { id },
      include: { checklist: true, inspections: { orderBy: { createdAt: 'desc' } }, staff: true },
    });
    if (!kitchen) throw new NotFoundException('Kitchen not found');
    return kitchen;
  }

  create(dto: CreateKitchenDto) {
    return this.prisma.kitchen.create({
      data: {
        ...dto,
        checklist: { create: DEFAULT_CHECKLIST.map((label) => ({ label, done: false })) },
      },
      include: { checklist: true },
    });
  }

  async update(id: string, dto: UpdateKitchenDto) {
    await this.ensure(id);
    return this.prisma.kitchen.update({ where: { id }, data: dto });
  }

  // ---- Checklist (pengawasan) ----
  async addChecklistItem(id: string, dto: ChecklistItemDto) {
    await this.ensure(id);
    return this.prisma.checklistItem.create({ data: { ...dto, kitchenId: id } });
  }

  toggleChecklist(itemId: string, done: boolean) {
    return this.prisma.checklistItem.update({ where: { id: itemId }, data: { done } });
  }

  removeChecklistItem(itemId: string) {
    return this.prisma.checklistItem.delete({ where: { id: itemId } });
  }

  // ---- Inspections (on-chain) ----
  async addInspection(id: string, dto: InspectionDto) {
    const kitchen = await this.ensure(id);
    const anchor = await this.blockchain.anchor({
      contract: 'PermitRegistry',
      method: 'recordInspection',
      summary: `Inspeksi ${kitchen.name} skor ${dto.score}`,
      actor: dto.inspector ?? 'Inspektur',
    });
    return this.prisma.inspection.create({
      data: { ...dto, kitchenId: id, txHash: anchor.txHash },
    });
  }

  // ---- Permit issuance (on-chain) ----
  async issuePermit(id: string, dto: IssuePermitDto) {
    const kitchen = await this.ensure(id);
    const anchor = await this.blockchain.anchor({
      contract: 'PermitRegistry',
      method: 'issuePermit',
      summary: `Izin diterbitkan untuk ${kitchen.name}`,
      actor: 'Badan Gizi Nasional',
    });
    return this.prisma.kitchen.update({
      where: { id },
      data: {
        izinStatus: PermitStatus.BERLAKU,
        izinNomor: dto.izinNomor,
        izinBerlaku: dto.izinBerlaku,
      },
      include: { checklist: true, _count: { select: { inspections: true } } },
    }).then((k) => ({ ...k, txHash: anchor.txHash }));
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.kitchen.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const kitchen = await this.prisma.kitchen.findUnique({ where: { id } });
    if (!kitchen) throw new NotFoundException('Kitchen not found');
    return kitchen;
  }
}
