import { Module } from '@nestjs/common';
import { GeoRulesService } from './geo-rules.service';
import { GeoRulesController } from './geo-rules.controller';

@Module({
  controllers: [GeoRulesController],
  providers: [GeoRulesService],
  exports: [GeoRulesService],
})
export class GeoRulesModule {}
