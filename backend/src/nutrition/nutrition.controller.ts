import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { NutritionService } from './nutrition.service';
import { AnalyzeMenuDto, CreateNutritionTargetDto, UpdateNutritionTargetDto } from './dto/nutrition.dto';

@ApiTags('Rencana Menu & Gizi')
@ApiBearerAuth()
@Controller('api/nutrition')
export class NutritionController {
  constructor(private readonly service: NutritionService) {}

  @Get('targets')
  findAll() {
    return this.service.findAll();
  }

  /** AKG-derived per-meal nutrition needs per school level / age group. */
  @Get('levels')
  levels() {
    return this.service.levels();
  }

  /** AI menu generator for a school level. */
  @Get('generate')
  generate(@Query('levelId') levelId: string) {
    return this.service.generate(levelId ?? 'sd13');
  }

  /** AI analysis: how well a menu meets the AKG target for a level. */
  @Post('analyze')
  analyze(@Body() dto: AnalyzeMenuDto) {
    return this.service.analyze(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Post('targets')
  create(@Body() dto: CreateNutritionTargetDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch('targets/:id')
  update(@Param('id') id: string, @Body() dto: UpdateNutritionTargetDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete('targets/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
