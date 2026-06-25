import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsOptional() @IsString() kode?: string;
  @IsString() komoditas: string;
  @IsNumber() qty: number;
  @IsString() satuan: string;
  @IsString() supplier: string;
  @IsNumber() nilai: number;
  @IsOptional() @IsString() status?: string; // Draft | Dikirim | Diterima | Menunggu Konfirmasi
  @IsOptional() @IsString() tanggal?: string;
}

export class UpdatePurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {}
