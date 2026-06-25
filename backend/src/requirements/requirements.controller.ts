import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { RequirementsService } from './requirements.service';
import { CreateRequirementDto, UpdateRequirementDto } from './dto/requirement.dto';

@ApiTags('Rantai Pasok')
@ApiBearerAuth()
@Controller('api/requirements')
export class RequirementsController {
  constructor(private readonly service: RequirementsService) {}

  @Get()
  findAll(@Query() q: PaginationQueryDto) {
    return this.service.findAll(q);
  }

  @Get('reorder-alerts')
  reorderAlerts() {
    return this.service.reorderAlerts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Post()
  create(@Body() dto: CreateRequirementDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRequirementDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
