import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto, UpdateCatalogDto } from './dto/catalog.dto';

@ApiTags('B2B Marketplace & RFQ')
@ApiBearerAuth()
@Controller('api/catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

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
  create(@Body() dto: CreateCatalogDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCatalogDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
