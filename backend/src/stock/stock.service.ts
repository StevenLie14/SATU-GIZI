import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StockStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AdjustStockDto, CreateStockDto, UpdateStockDto } from './dto/stock.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { nama: { contains: q.search, mode: 'insensitive' } },
            { gudang: { contains: q.search, mode: 'insensitive' } },
            { kategori: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.stockItem, q, { where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.stockItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Stock item not found');
    return item;
  }

  create(dto: CreateStockDto) {
    return this.prisma.stockItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateStockDto) {
    await this.findOne(id);
    return this.prisma.stockItem.update({ where: { id }, data: dto });
  }

  /** Increment/decrement quantity and recompute a simple status. */
  async adjust(id: string, dto: AdjustStockDto) {
    const item = await this.findOne(id);
    const jumlah = item.jumlah + dto.delta;
    if (jumlah < 0) throw new BadRequestException('Insufficient stock for this adjustment');
    const status: StockStatus =
      jumlah <= 0 ? StockStatus.KRITIS : jumlah < item.jumlah * 0.25 ? StockStatus.MENIPIS : StockStatus.AMAN;
    return this.prisma.stockItem.update({ where: { id }, data: { jumlah, status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.stockItem.delete({ where: { id } });
  }
}
