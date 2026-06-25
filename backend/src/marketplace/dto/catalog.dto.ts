import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCatalogDto {
  @IsString() nama: string;
  @IsString() kategori: string;
  @IsString() satuan: string;
  @IsNumber() hargaRef: number;
  @IsOptional() @IsInt() supplierAktif?: number;
  @IsOptional() @IsNumber() ratingRata?: number;
  @IsOptional() @IsString() lokasiTerdekat?: string;
}

export class UpdateCatalogDto extends PartialType(CreateCatalogDto) {}
