import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { KitchensService } from './kitchens.service';
import {
  ChecklistItemDto,
  CreateKitchenDto,
  InspectionDto,
  IssuePermitDto,
  ToggleChecklistDto,
  UpdateKitchenDto,
} from './dto/kitchen.dto';

@ApiTags('Manajemen Data — Perizinan & Pengawasan')
@ApiBearerAuth()
@Controller('api/kitchens')
export class KitchensController {
  constructor(private readonly service: KitchensService) {}

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
  create(@Body() dto: CreateKitchenDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKitchenDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Post(':id/checklist')
  addChecklist(@Param('id') id: string, @Body() dto: ChecklistItemDto) {
    return this.service.addChecklistItem(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch('checklist/:itemId')
  toggleChecklist(@Param('itemId') itemId: string, @Body() dto: ToggleChecklistDto) {
    return this.service.toggleChecklist(itemId, dto.done);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete('checklist/:itemId')
  removeChecklist(@Param('itemId') itemId: string) {
    return this.service.removeChecklistItem(itemId);
  }

  @Roles(Role.PEMERINTAH)
  @Post(':id/inspections')
  addInspection(@Param('id') id: string, @Body() dto: InspectionDto) {
    return this.service.addInspection(id, dto);
  }

  @Roles(Role.PEMERINTAH)
  @Patch(':id/issue-permit')
  issuePermit(@Param('id') id: string, @Body() dto: IssuePermitDto) {
    return this.service.issuePermit(id, dto);
  }

  @Roles(Role.PEMERINTAH)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
