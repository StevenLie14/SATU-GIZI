import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { GenericStatus } from '@prisma/client';

export class CreatePartnerDto {
  @IsString() nama: string;
  @IsString() jenis: string;
  @IsOptional() @IsString() pic?: string;
  @IsOptional() @IsString() kontak?: string;
  @IsOptional() @IsString() kontrak?: string;
  @IsOptional() @IsEnum(GenericStatus) status?: GenericStatus;
  @IsOptional() @IsNumber() rating?: number;
}

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {}
