import { PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { GenericStatus } from '@prisma/client';

export class CreateSupplierDto {
  @IsString() nama: string;
  @IsArray() @IsString({ each: true }) komoditas: string[];
  @IsString() lokasi: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
  @IsOptional() @IsInt() hargaIndex?: number;
  @IsOptional() @IsString() leadTime?: string;
  @IsOptional() @IsNumber() rating?: number;
  @IsOptional() @IsEnum(GenericStatus) status?: GenericStatus;
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
