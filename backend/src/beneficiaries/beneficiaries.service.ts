import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { haversineKm, round1 } from '../common/utils/geo';
import { GeoRulesService } from '../geo-rules/geo-rules.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from './dto/beneficiary.dto';

@Injectable()
export class BeneficiariesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geoRules: GeoRulesService,
  ) {}

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

  /**
   * Rekomendasi dapur untuk sebuah titik: semua dapur diurutkan berdasarkan
   * jarak; radius efektif = serviceRadiusKm dapur ?? radius aturan global.
   */
  async recommendKitchens(lat: number, lng: number) {
    const [rule, kitchens] = await Promise.all([
      this.geoRules.getRule('SCHOOL_ASSIGNMENT'),
      this.prisma.kitchen.findMany(),
    ]);
    const recommendations = kitchens
      .map((k) => {
        const distanceKm = round1(haversineKm({ lat, lng }, { lat: k.latitude, lng: k.longitude }));
        const radiusKm = k.serviceRadiusKm ?? rule.radiusKm;
        return {
          kitchenId: k.id,
          name: k.name,
          address: k.address,
          distanceKm,
          radiusKm,
          inRadius: rule.active ? distanceKm <= radiusKm : true,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
    return { rule: { radiusKm: rule.radiusKm, active: rule.active }, recommendations };
  }

  async create(dto: CreateBeneficiaryDto) {
    let autoAssigned = false;
    let jarakKm: number | undefined;
    if (!dto.kitchenId) {
      const { recommendations } = await this.recommendKitchens(dto.latitude, dto.longitude);
      const best = recommendations.find((r) => r.inRadius);
      if (best) {
        dto.kitchenId = best.kitchenId;
        autoAssigned = true;
        jarakKm = best.distanceKm;
      }
    }
    const school = await this.prisma.school.create({
      data: dto,
      include: { kitchen: { select: { id: true, name: true } } },
    });
    return { ...school, autoAssigned, jarakKm };
  }

  async update(id: string, dto: UpdateBeneficiaryDto) {
    const existing = await this.findOne(id);
    // Koordinat baru tanpa dapur eksplisit + sekolah belum punya dapur → coba auto-assign
    if (
      dto.kitchenId === undefined &&
      !existing.kitchenId &&
      dto.latitude !== undefined &&
      dto.longitude !== undefined
    ) {
      const { recommendations } = await this.recommendKitchens(dto.latitude, dto.longitude);
      const best = recommendations.find((r) => r.inRadius);
      if (best) dto.kitchenId = best.kitchenId;
    }
    return this.prisma.school.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.school.delete({ where: { id } });
  }
}
