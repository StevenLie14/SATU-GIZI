import { BadRequestException, Injectable } from '@nestjs/common';
import { GeoRuleScope } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGeoRuleDto } from './dto/geo-rule.dto';

export interface EffectiveGeoRule {
  scope: GeoRuleScope;
  radiusKm: number;
  centerLat: number | null;
  centerLng: number | null;
  active: boolean;
}

const DEFAULT_RADIUS_KM: Record<GeoRuleScope, number> = {
  SCHOOL_ASSIGNMENT: 10,
  SUPPLIER_MATCH: 60,
  REDISTRIBUTION: 160,
};

@Injectable()
export class GeoRulesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Selalu mengembalikan ketiga scope; yang belum tersimpan diisi default. */
  async findAll(): Promise<EffectiveGeoRule[]> {
    const rows = await this.prisma.geoRule.findMany();
    return Object.values(GeoRuleScope).map((scope) => {
      const row = rows.find((r) => r.scope === scope);
      return row ?? this.defaultRule(scope);
    });
  }

  async getRule(scope: GeoRuleScope): Promise<EffectiveGeoRule> {
    const row = await this.prisma.geoRule.findUnique({ where: { scope } });
    return row ?? this.defaultRule(scope);
  }

  update(scope: string, dto: UpdateGeoRuleDto) {
    if (!Object.values(GeoRuleScope).includes(scope as GeoRuleScope)) {
      throw new BadRequestException('Scope aturan wilayah tidak valid');
    }
    const s = scope as GeoRuleScope;
    return this.prisma.geoRule.upsert({
      where: { scope: s },
      update: dto,
      create: {
        scope: s,
        radiusKm: dto.radiusKm ?? DEFAULT_RADIUS_KM[s],
        centerLat: dto.centerLat,
        centerLng: dto.centerLng,
        active: dto.active ?? true,
      },
    });
  }

  private defaultRule(scope: GeoRuleScope): EffectiveGeoRule {
    return {
      scope,
      radiusKm: DEFAULT_RADIUS_KM[scope],
      centerLat: null,
      centerLng: null,
      active: true,
    };
  }
}
