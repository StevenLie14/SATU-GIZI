import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StockStatus } from '@prisma/client';

export class CreateStockDto {
  @IsString() nama: string;
  @IsString() kategori: string;
  @IsNumber() jumlah: number;
  @IsString() satuan: string;
  @IsString() gudang: string;
  @IsOptional() @IsString() kadaluarsa?: string;
  @IsOptional() @IsEnum(StockStatus) status?: StockStatus;
}

export class UpdateStockDto extends PartialType(CreateStockDto) {}

export class AdjustStockDto {
  /** Positive to add stock, negative to consume. */
  @IsNumber() delta: number;
  @IsOptional() @IsString() reason?: string;
}
