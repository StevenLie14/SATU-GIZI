import { Module } from '@nestjs/common';
import { GeoRulesModule } from '../geo-rules/geo-rules.module';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [GeoRulesModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
