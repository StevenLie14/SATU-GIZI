import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { menuUtama: { contains: q.search, mode: 'insensitive' } },
            { lauk: { contains: q.search, mode: 'insensitive' } },
            { week: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.menuPlan, q, { where, orderBy: { createdAt: 'asc' } });
  }

  async findOne(id: string) {
    const plan = await this.prisma.menuPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Rencana menu tidak ditemukan');
    return plan;
  }

  create(dto: CreateMenuDto) {
    return this.prisma.menuPlan.create({ data: dto });
  }

  async update(id: string, dto: UpdateMenuDto) {
    await this.findOne(id);
    return this.prisma.menuPlan.update({ where: { id }, data: dto });
  }

  async setStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.menuPlan.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.menuPlan.delete({ where: { id } });
  }
}
