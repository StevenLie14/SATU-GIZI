import { Module } from '@nestjs/common';
import { KitchenStaffService } from './kitchen-staff.service';
import { KitchenStaffController } from './kitchen-staff.controller';

@Module({
  controllers: [KitchenStaffController],
  providers: [KitchenStaffService],
})
export class KitchenStaffModule {}
