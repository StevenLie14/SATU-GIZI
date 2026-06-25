import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateKitchenStaffDto {
  @IsString() nama: string;
  @IsString() peran: string;
  @IsOptional() @IsString() sertifikasi?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() kitchenId?: string;
}

export class UpdateKitchenStaffDto extends PartialType(CreateKitchenStaffDto) {}
