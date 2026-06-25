import { Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateBudgetItemDto, UpdateBudgetItemDto } from './dto/budget.dto';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { item: { contains: q.search, mode: 'insensitive' } },
            { kategori: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.budgetItem, q, { where, orderBy: { createdAt: 'desc' } });
  }

  /** Aggregated totals for dashboard cards. */
  async summary() {
    const items = await this.prisma.budgetItem.findMany();
    const total = items.reduce((a, b) => a + b.qty * b.hargaSatuan, 0);
    const approved = items
      .filter((b) => b.status === ApprovalStatus.DISETUJUI)
      .reduce((a, b) => a + b.qty * b.hargaSatuan, 0);
    const pending = items
      .filter((b) => b.status === ApprovalStatus.MENUNGGU)
      .reduce((a, b) => a + b.qty * b.hargaSatuan, 0);
    return { total, approved, pending, count: items.length };
  }

  async findOne(id: string) {
    const item = await this.prisma.budgetItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Budget item not found');
    return item;
  }

  create(dto: CreateBudgetItemDto) {
    return this.prisma.budgetItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateBudgetItemDto) {
    await this.findOne(id);
    return this.prisma.budgetItem.update({ where: { id }, data: dto });
  }

  async setStatus(id: string, status: ApprovalStatus) {
    await this.findOne(id);
    return this.prisma.budgetItem.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.budgetItem.delete({ where: { id } });
  }
}
