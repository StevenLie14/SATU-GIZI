import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './dto/beneficiary.dto';

@Injectable()
export class BeneficiariesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { name: { contains: q.search, mode: 'insensitive' } },
            { address: { contains: q.search, mode: 'insensitive' } },
            { jenjang: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.school, q, {
      where,
      orderBy: { name: 'asc' },
      include: { kitchen: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({ where: { id }, include: { kitchen: true } });
    if (!school) throw new NotFoundException('Penerima manfaat tidak ditemukan');
    return school;
  }

  create(dto: CreateBeneficiaryDto) {
    return this.prisma.school.create({ data: dto });
  }

  async update(id: string, dto: UpdateBeneficiaryDto) {
    await this.findOne(id);
    return this.prisma.school.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.school.delete({ where: { id } });
  }
}
