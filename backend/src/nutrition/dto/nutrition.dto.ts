import { PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNutritionTargetDto {
  @IsString() kelompok: string;
  @IsOptional() @IsString() ageRange?: string;
  @IsOptional() @IsString() jenjang?: string;
  @IsInt() energi: number;
  @IsInt() protein: number;
  @IsInt() lemak: number;
  @IsInt() karbohidrat: number;
  @IsInt() serat: number;
  @IsOptional() @IsInt() realisasiEnergi?: number;
}

export class UpdateNutritionTargetDto extends PartialType(CreateNutritionTargetDto) {}

export class AnalyzeMenuDto {
  @IsString() levelId: string; // paud | sd13 | sd46 | smp | sma
  @IsString() menuUtama: string;
  @IsString() lauk: string;
  @IsOptional() @IsString() sayur?: string;
  @IsOptional() @IsString() buah?: string;
}
