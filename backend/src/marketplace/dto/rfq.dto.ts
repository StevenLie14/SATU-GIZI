import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { RfqStatus } from '@prisma/client';

export class CreateRfqDto {
  @IsOptional() @IsString() kode?: string;
  @IsString() komoditas: string;
  @IsNumber() qty: number;
  @IsString() satuan: string;
  @IsString() buyer: string;
  @IsOptional() @IsString() deadline?: string;
  @IsOptional() @IsEnum(RfqStatus) status?: RfqStatus;
}

export class UpdateRfqDto extends PartialType(CreateRfqDto) {}

export class CreateQuoteDto {
  @IsString() supplier: string;
  @IsOptional() @IsString() lokasi?: string;
  @IsOptional() @IsNumber() jarakKm?: number;
  @IsNumber() hargaSatuan: number;
  @IsOptional() @IsInt() priceIndex?: number;
  @IsOptional() @IsInt() leadTimeDays?: number;
  @IsOptional() @IsNumber() rating?: number;
  @IsOptional() @IsInt() reliability?: number;
  @IsOptional() @IsString() catatan?: string;
}

export class AwardRfqDto {
  @IsString() supplier: string;
}
