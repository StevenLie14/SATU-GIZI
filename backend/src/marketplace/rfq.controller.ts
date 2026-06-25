import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { RfqService } from './rfq.service';
import { AwardRfqDto, CreateQuoteDto, CreateRfqDto, UpdateRfqDto } from './dto/rfq.dto';

@ApiTags('B2B Marketplace & RFQ')
@ApiBearerAuth()
@Controller('api/rfq')
export class RfqController {
  constructor(private readonly service: RfqService) {}

  @Get()
  findAll(@Query() q: PaginationQueryDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Post()
  create(@Body() dto: CreateRfqDto) {
    return this.service.create(dto);
  }

  @Roles(Role.MITRA)
  @Post(':id/quotes')
  addQuote(@Param('id') id: string, @Body() dto: CreateQuoteDto) {
    return this.service.addQuote(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch(':id/award')
  award(@Param('id') id: string, @Body() dto: AwardRfqDto) {
    return this.service.award(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRfqDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
