import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString() judul: string;
  @IsString() pesan: string;
  @IsOptional() @IsString() kategori?: string; // Distribusi | Stok | Anggaran | Sistem | Ulasan
  @IsOptional() @IsString() userId?: string;
  @IsOptional() @IsBoolean() dibaca?: boolean;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
