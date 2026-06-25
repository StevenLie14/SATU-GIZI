import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';
import { CreateRedistributionDto } from './dto/redistribution.dto';

@ApiTags('Analitik & Peramalan')
@ApiBearerAuth()
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Get('demand-forecast')
  demandForecast() {
    return this.service.demandForecast();
  }

  @Get('price-forecast')
  priceForecast() {
    return this.service.priceForecast();
  }

  @Get('region-balance')
  regionBalance() {
    return this.service.regionBalance();
  }

  @Get('redistribution')
  redistribution() {
    return this.service.redistribution();
  }

  @Roles(Role.PEMERINTAH, Role.SPPG)
  @Post('redistribution')
  schedule(@Body() dto: CreateRedistributionDto) {
    return this.service.scheduleRedistribution(dto);
  }
}
