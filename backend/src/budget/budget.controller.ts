import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { BudgetService } from './budget.service';
import { CreateBudgetItemDto, SetApprovalDto, UpdateBudgetItemDto } from './dto/budget.dto';

@ApiTags('Manajemen Anggaran')
@ApiBearerAuth()
@Controller('api/budget')
export class BudgetController {
  constructor(private readonly service: BudgetService) {}

  @Get()
  findAll(@Query() q: PaginationQueryDto) {
    return this.service.findAll(q);
  }

  @Get('summary')
  summary() {
    return this.service.summary();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Post()
  create(@Body() dto: CreateBudgetItemDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH)
  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: SetApprovalDto) {
    return this.service.setStatus(id, dto.status);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBudgetItemDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
