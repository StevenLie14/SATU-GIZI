import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateRequirementDto, UpdateRequirementDto } from './dto/requirement.dto';

@Injectable()
export class RequirementsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? { komoditas: { contains: q.search, mode: 'insensitive' } }
      : undefined;
    return paginate(this.prisma.requirementPlan, q, { where, orderBy: { komoditas: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.requirementPlan.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Requirement plan not found');
    return item;
  }

  create(dto: CreateRequirementDto) {
    return this.prisma.requirementPlan.create({ data: dto });
  }

  async update(id: string, dto: UpdateRequirementDto) {
    await this.findOne(id);
    return this.prisma.requirementPlan.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.requirementPlan.delete({ where: { id } });
  }

  /** Items at or below their reorder point — feeds AI procurement suggestions. */
  reorderAlerts() {
    return this.prisma.$queryRaw`SELECT * FROM "RequirementPlan" WHERE "stokSaatIni" <= "reorderPoint"`;
  }
}
