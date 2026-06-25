import { PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString() hari: string;
  @IsOptional() @IsString() tanggal?: string;
  @IsOptional() @IsString() week?: string;
  @IsString() menuUtama: string;
  @IsString() lauk: string;
  @IsOptional() @IsString() sayur?: string;
  @IsOptional() @IsString() buah?: string;
  @IsOptional() @IsInt() kalori?: number;
  @IsOptional() @IsString() status?: string; // Draft | Terjadwal | Disetujui
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

export class SetMenuStatusDto {
  @IsString() status: string;
}
