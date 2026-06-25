import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { DistributionService } from './distribution.service';
import { CreateBatchDto, QueryBatchDto, UpdateBatchDto } from './dto/batch.dto';

@ApiTags('Distribusi & Dokumentasi')
@ApiBearerAuth()
@Controller('api/distribution')
export class DistributionController {
  constructor(private readonly service: DistributionService) {}

  @Get()
  findAll(@Query() q: QueryBatchDto) {
    return this.service.findAll(q);
  }

  @Get('pipeline')
  pipeline() {
    return this.service.pipeline();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Post()
  create(@Body() dto: CreateBatchDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch(':id/advance')
  advance(@Param('id') id: string) {
    return this.service.advanceStage(id);
  }

  @Roles(Role.SEKOLAH, Role.PEMERINTAH, Role.SPPG)
  @Patch(':id/confirm-receipt')
  confirmReceipt(@Param('id') id: string) {
    return this.service.confirmReceipt(id);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBatchDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
