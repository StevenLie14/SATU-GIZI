import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreatePersonnelDto, UpdatePersonnelDto } from './dto/personnel.dto';

@Injectable()
export class PersonnelService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { nama: { contains: q.search, mode: 'insensitive' } },
            { area: { contains: q.search, mode: 'insensitive' } },
            { peran: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.personnel, q, { where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const person = await this.prisma.personnel.findUnique({ where: { id } });
    if (!person) throw new NotFoundException('Personel tidak ditemukan');
    return person;
  }

  create(dto: CreatePersonnelDto) {
    return this.prisma.personnel.create({ data: dto });
  }

  async update(id: string, dto: UpdatePersonnelDto) {
    await this.findOne(id);
    return this.prisma.personnel.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.personnel.delete({ where: { id } });
  }
}
