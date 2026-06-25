import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequirementDto {
  @IsString() komoditas: string;
  @IsNumber() kebutuhanMingguan: number;
  @IsString() satuan: string;
  @IsNumber() stokSaatIni: number;
  @IsNumber() reorderPoint: number;
  @IsOptional() @IsString() proyeksiHabis?: string;
}

export class UpdateRequirementDto extends PartialType(CreateRequirementDto) {}
