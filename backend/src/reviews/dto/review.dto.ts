import { PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString() penilai: string;
  @IsInt() @Min(1) @Max(5) rating: number;
  @IsOptional() @IsInt() @Min(0) @Max(5) rasa?: number;
  @IsOptional() @IsInt() @Min(0) @Max(5) porsi?: number;
  @IsOptional() @IsInt() @Min(0) @Max(5) kebersihan?: number;
  @IsOptional() @IsString() komentar?: string;
  @IsOptional() @IsString() tanggal?: string;
  @IsOptional() @IsString() tag?: string; // Positif | Netral | Keluhan
  @IsOptional() @IsString() schoolId?: string;
  @IsOptional() @IsString() sekolah?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
