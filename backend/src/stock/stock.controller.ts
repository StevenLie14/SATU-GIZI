import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { StockService } from './stock.service';
import { AdjustStockDto, CreateStockDto, UpdateStockDto } from './dto/stock.dto';

@ApiTags('Rantai Pasok')
@ApiBearerAuth()
@Controller('api/stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  findAll(@Query() q: PaginationQueryDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Post()
  create(@Body() dto: CreateStockDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Patch(':id/adjust')
  adjust(@Param('id') id: string, @Body() dto: AdjustStockDto) {
    return this.service.adjust(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
