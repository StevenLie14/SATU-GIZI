import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AGE_LEVELS,
  analyzeMenu,
  generateMenuForLevel,
  getLevel,
  nutritionTargetFor,
} from '../common/utils/nutrition';
import { AnalyzeMenuDto, CreateNutritionTargetDto, UpdateNutritionTargetDto } from './dto/nutrition.dto';

@Injectable()
export class NutritionService {
  constructor(private readonly prisma: PrismaService) {}

  // ---- Gramasi gizi targets (per kelompok) ----
  findAll() {
    return this.prisma.nutritionTarget.findMany({ orderBy: { energi: 'asc' } });
  }

  async findOne(id: string) {
    const t = await this.prisma.nutritionTarget.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Target gizi tidak ditemukan');
    return t;
  }

  create(dto: CreateNutritionTargetDto) {
    return this.prisma.nutritionTarget.create({ data: dto });
  }

  async update(id: string, dto: UpdateNutritionTargetDto) {
    await this.findOne(id);
    return this.prisma.nutritionTarget.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.nutritionTarget.delete({ where: { id } });
  }

  // ---- AI nutrition engine (AKG per school level / age) ----
  /** AKG-derived per-meal targets for every school level. */
  levels() {
    return AGE_LEVELS.map((l) => ({
      id: l.id,
      label: l.label,
      ageRange: l.ageRange,
      jenjang: l.jenjang,
      mealFraction: l.mealFraction,
      akgHarian: l.akgHarian,
      targetPerMeal: nutritionTargetFor(l),
    }));
  }

  /** Analyse a menu against the target for a given level. */
  analyze(dto: AnalyzeMenuDto) {
    const level = getLevel(dto.levelId);
    return analyzeMenu(dto, level);
  }

  /** AI-compose a balanced menu for a level, with its analysis. */
  generate(levelId: string) {
    const level = getLevel(levelId);
    const menu = generateMenuForLevel(level);
    return { menu, analysis: analyzeMenu(menu, level) };
  }
}
