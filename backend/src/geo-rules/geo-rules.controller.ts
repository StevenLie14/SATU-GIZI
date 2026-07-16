import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { GeoRulesService } from './geo-rules.service';
import { UpdateGeoRuleDto } from './dto/geo-rule.dto';

@ApiTags('Aturan Wilayah')
@ApiBearerAuth()
@Controller('api/geo-rules')
export class GeoRulesController {
  constructor(private readonly service: GeoRulesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles(Role.PEMERINTAH, Role.ADMIN)
  @Patch(':scope')
  update(@Param('scope') scope: string, @Body() dto: UpdateGeoRuleDto) {
    return this.service.update(scope, dto);
  }
}
