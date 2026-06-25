import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { VendorVerificationService } from './vendor-verification.service';
import {
  CertificateDto,
  CreateVendorVerificationDto,
  UpdateVendorVerificationDto,
} from './dto/vendor-verification.dto';

@ApiTags('Manajemen Data — Verifikasi Vendor (BGN)')
@ApiBearerAuth()
@Controller('api/vendor-verification')
export class VendorVerificationController {
  constructor(private readonly service: VendorVerificationService) {}

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

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Post()
  create(@Body() dto: CreateVendorVerificationDto) {
    return this.service.create(dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVendorVerificationDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Post(':id/certificates')
  addCertificate(@Param('id') id: string, @Body() dto: CertificateDto) {
    return this.service.addCertificate(id, dto);
  }

  @Roles(Role.PEMERINTAH)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approveBGN(id);
  }

  @Roles(Role.PEMERINTAH)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
