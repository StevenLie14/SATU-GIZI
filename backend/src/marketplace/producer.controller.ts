import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ProducerService } from './producer.service';
import { CreateProducerDto, UpdateProducerDto } from './dto/producer.dto';

@ApiTags('B2B Marketplace & RFQ')
@ApiBearerAuth()
@Controller('api/producers')
export class ProducerController {
  constructor(private readonly service: ProducerService) {}

  @Get()
  findAll(@Query() q: PaginationQueryDto) {
    return this.service.findAll(q);
  }

  @Get('impact')
  impact() {
    return this.service.impact();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Post()
  create(@Body() dto: CreateProducerDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
