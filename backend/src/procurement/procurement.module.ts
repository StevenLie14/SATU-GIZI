import { Module } from '@nestjs/common';
import { GeoRulesModule } from '../geo-rules/geo-rules.module';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';

@Module({
  imports: [GeoRulesModule],
  controllers: [ProcurementController],
  providers: [ProcurementService],
})
export class ProcurementModule {}
