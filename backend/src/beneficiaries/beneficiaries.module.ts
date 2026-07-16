import { Module } from '@nestjs/common';
import { GeoRulesModule } from '../geo-rules/geo-rules.module';
import { BeneficiariesService } from './beneficiaries.service';
import { BeneficiariesController } from './beneficiaries.controller';

@Module({
  imports: [GeoRulesModule],
  controllers: [BeneficiariesController],
  providers: [BeneficiariesService],
})
export class BeneficiariesModule {}
