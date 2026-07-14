import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateKitchenStaffDto, UpdateKitchenStaffDto } from './dto/kitchen-staff.dto';

@Injectable()
export class KitchenStaffService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { nama: { contains: q.search, mode: 'insensitive' } },
            { peran: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.kitchenStaff, q, {
      where,
      orderBy: { createdAt: 'desc' },
      include: { kitchen: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    const staff = await this.prisma.kitchenStaff.findUnique({ where: { id }, include: { kitchen: true } });
    if (!staff) throw new NotFoundException('Staf dapur tidak ditemukan');
    return staff;
  }

  create(dto: CreateKitchenStaffDto) {
    return this.prisma.kitchenStaff.create({ data: dto });
  }

  async update(id: string, dto: UpdateKitchenStaffDto) {
    await this.findOne(id);
    return this.prisma.kitchenStaff.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.kitchenStaff.delete({ where: { id } });
  }
}
