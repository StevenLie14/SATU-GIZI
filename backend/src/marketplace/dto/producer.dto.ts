import { PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProducerDto {
  @IsString() nama: string;
  @IsString() jenis: string;
  @IsString() lokasi: string;
  @IsArray() @IsString({ each: true }) komoditas: string[];
  @IsOptional() @IsString() kapasitasBulanan?: string;
  @IsOptional() @IsBoolean() isUMKM?: boolean;
  @IsOptional() @IsNumber() rating?: number;
  @IsOptional() @IsInt() tenagaKerja?: number;
  @IsOptional() @IsString() status?: string; // Mitra Aktif | Calon Mitra
}

export class UpdateProducerDto extends PartialType(CreateProducerDto) {}
