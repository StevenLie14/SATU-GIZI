import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePersonnelDto {
  @IsString() nama: string;
  @IsString() peran: string; // Driver | Kader | Koordinator
  @IsString() area: string;
  @IsOptional() @IsString() kontak?: string;
  @IsOptional() @IsString() status?: string; // Bertugas | Standby | Off
  @IsOptional() @IsInt() pengiriman?: number;
  @IsOptional() @IsNumber() rating?: number;
}

export class UpdatePersonnelDto extends PartialType(CreatePersonnelDto) {}
