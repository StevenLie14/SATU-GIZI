import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateProducerDto, UpdateProducerDto } from './dto/producer.dto';

@Injectable()
export class ProducerService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { nama: { contains: q.search, mode: 'insensitive' } },
            { lokasi: { contains: q.search, mode: 'insensitive' } },
            { jenis: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.localProducer, q, { where, orderBy: { rating: 'desc' } });
  }

  /** Aggregate impact metrics: UMKM empowered & jobs supported. */
  async impact() {
    const producers = await this.prisma.localProducer.findMany();
    return {
      total: producers.length,
      umkm: producers.filter((p) => p.isUMKM).length,
      mitraAktif: producers.filter((p) => p.status === 'Mitra Aktif').length,
      tenagaKerja: producers.reduce((a, p) => a + p.tenagaKerja, 0),
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.localProducer.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Produsen lokal tidak ditemukan');
    return item;
  }

  create(dto: CreateProducerDto) {
    return this.prisma.localProducer.create({ data: dto });
  }

  async update(id: string, dto: UpdateProducerDto) {
    await this.findOne(id);
    return this.prisma.localProducer.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.localProducer.delete({ where: { id } });
  }
}
