import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { MenuService } from './menu.service';
import { CreateMenuDto, SetMenuStatusDto, UpdateMenuDto } from './dto/menu.dto';

@ApiTags('Rencana Menu & Gizi')
@ApiBearerAuth()
@Controller('api/menu')
export class MenuController {
  constructor(private readonly service: MenuService) {}

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
  create(@Body() dto: CreateMenuDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH)
  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: SetMenuStatusDto) {
    return this.service.setStatus(id, dto.status);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
