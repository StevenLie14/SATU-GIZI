import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString() nama: string;
  @IsString() kategori: string;
  @IsNumber() perPorsi: number;
  @IsString() satuan: string;
  @IsNumber() hargaSatuan: number;
  @IsOptional() @IsString() supplier?: string;
}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
