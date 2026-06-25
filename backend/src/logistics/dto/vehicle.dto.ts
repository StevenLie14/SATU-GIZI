import { PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString() plat: string;
  @IsString() jenis: string;
  @IsOptional() @IsString() driver?: string;
  @IsInt() kapasitas: number;
  @IsOptional() @IsInt() muatan?: number;
  @IsOptional() @IsString() rute?: string;
  @IsOptional() @IsString() status?: string; // Dalam Perjalanan | Siap | Maintenance
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
