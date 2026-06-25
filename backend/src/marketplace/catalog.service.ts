import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateCatalogDto, UpdateCatalogDto } from './dto/catalog.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { nama: { contains: q.search, mode: 'insensitive' } },
            { kategori: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.catalogItem, q, { where, orderBy: { nama: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.catalogItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Catalog item not found');
    return item;
  }

  create(dto: CreateCatalogDto) {
    return this.prisma.catalogItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateCatalogDto) {
    await this.findOne(id);
    return this.prisma.catalogItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.catalogItem.delete({ where: { id } });
  }
}
