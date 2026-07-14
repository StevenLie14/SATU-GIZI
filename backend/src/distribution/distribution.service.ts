import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DistributionStage } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { CreateBatchDto, QueryBatchDto, UpdateBatchDto } from './dto/batch.dto';

const STAGE_ORDER: DistributionStage[] = [
  DistributionStage.PRODUKSI,
  DistributionStage.PENGEMASAN,
  DistributionStage.TRANSIT,
  DistributionStage.TIBA,
  DistributionStage.SELESAI,
];

const progressFor = (stage: DistributionStage) =>
  Math.round(((STAGE_ORDER.indexOf(stage) + 1) / STAGE_ORDER.length) * 100);

@Injectable()
export class DistributionService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: QueryBatchDto) {
    const and: any[] = [];
    if (q.stage) and.push({ stage: q.stage });
    if (q.search)
      and.push({
        OR: [
          { kode: { contains: q.search, mode: 'insensitive' } },
          { menu: { contains: q.search, mode: 'insensitive' } },
          { driver: { contains: q.search, mode: 'insensitive' } },
        ],
      });
    const where = and.length ? { AND: and } : undefined;
    return paginate(this.prisma.distributionBatch, q, {
      where,
      orderBy: { createdAt: 'desc' },
      include: { kitchen: { select: { name: true } }, school: { select: { name: true } } },
    });
  }

  /** Counts per pipeline stage for the monitoring board. */
  async pipeline() {
    const grouped = await this.prisma.distributionBatch.groupBy({
      by: ['stage'],
      _count: { _all: true },
    });
    return STAGE_ORDER.map((stage) => ({
      stage,
      count: grouped.find((g) => g.stage === stage)?._count._all ?? 0,
    }));
  }

  async findOne(id: string) {
    const batch = await this.prisma.distributionBatch.findUnique({
      where: { id },
      include: { kitchen: true, school: true },
    });
    if (!batch) throw new NotFoundException('Batch tidak ditemukan');
    return batch;
  }

  create(dto: CreateBatchDto) {
    const stage = dto.stage ?? DistributionStage.PRODUKSI;
    const kode = dto.kode ?? `MBG-${Date.now().toString().slice(-7)}`;
    return this.prisma.distributionBatch.create({
      data: { ...dto, kode, stage, progress: progressFor(stage) },
    });
  }

  async update(id: string, dto: UpdateBatchDto) {
    await this.ensure(id);
    const data: any = { ...dto };
    if (dto.stage) data.progress = progressFor(dto.stage);
    return this.prisma.distributionBatch.update({ where: { id }, data });
  }

  /** Move a batch to the next stage in the pipeline. */
  async advanceStage(id: string) {
    const batch = await this.ensure(id);
    const idx = STAGE_ORDER.indexOf(batch.stage);
    if (idx >= STAGE_ORDER.length - 1) throw new BadRequestException('Batch sudah selesai');
    const stage = STAGE_ORDER[idx + 1];
    return this.prisma.distributionBatch.update({
      where: { id },
      data: { stage, progress: progressFor(stage) },
    });
  }

  /** School confirms receipt — marks the batch complete. */
  async confirmReceipt(id: string) {
    await this.ensure(id);
    return this.prisma.distributionBatch.update({
      where: { id },
      data: { stage: DistributionStage.SELESAI, progress: 100 },
    });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.distributionBatch.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const batch = await this.prisma.distributionBatch.findUnique({ where: { id } });
    if (!batch) throw new NotFoundException('Batch tidak ditemukan');
    return batch;
  }
}
