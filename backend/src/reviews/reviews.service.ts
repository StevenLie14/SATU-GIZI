import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { sekolah: { contains: q.search, mode: 'insensitive' } },
            { penilai: { contains: q.search, mode: 'insensitive' } },
            { komentar: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.review, q, { where, orderBy: { createdAt: 'desc' } });
  }

  /** Average rating + sentiment breakdown for dashboards. */
  async stats() {
    const reviews = await this.prisma.review.findMany();
    const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
    return {
      total: reviews.length,
      averageRating: Math.round(avg * 10) / 10,
      positif: reviews.filter((r) => r.tag === 'Positif').length,
      netral: reviews.filter((r) => r.tag === 'Netral').length,
      keluhan: reviews.filter((r) => r.tag === 'Keluhan').length,
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  create(dto: CreateReviewDto) {
    return this.prisma.review.create({ data: dto });
  }

  async update(id: string, dto: UpdateReviewDto) {
    await this.findOne(id);
    return this.prisma.review.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.review.delete({ where: { id } });
  }
}
