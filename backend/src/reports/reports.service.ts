import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { judul: { contains: q.search, mode: 'insensitive' } },
            { dapur: { contains: q.search, mode: 'insensitive' } },
            { periode: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.opsReport, q, { where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const report = await this.prisma.opsReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  create(dto: CreateReportDto) {
    return this.prisma.opsReport.create({ data: dto });
  }

  async update(id: string, dto: UpdateReportDto) {
    await this.findOne(id);
    return this.prisma.opsReport.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.opsReport.delete({ where: { id } });
  }
}
