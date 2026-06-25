import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString() judul: string;
  @IsString() periode: string;
  @IsString() dapur: string;
  @IsInt() porsiTerkirim: number;
  @IsInt() porsiTerencana: number;
  @IsNumber() realisasiBiaya: number;
  @IsOptional() @IsString() status?: string; // Final | Draft | Direview
  @IsOptional() @IsString() tanggal?: string;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {}
