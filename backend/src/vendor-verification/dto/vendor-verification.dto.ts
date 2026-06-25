import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateVendorVerificationDto {
  @IsString() nama: string;
  @IsString() jenisUsaha: string;
  @IsString() lokasi: string;
  @IsOptional() @IsString() pic?: string;
  @IsOptional() @IsString() kontak?: string;
  @IsString() npwp: string;
  @IsString() nib: string;
  @IsOptional() @IsBoolean() isUMKM?: boolean;
  @IsOptional() @IsInt() @Min(0) @Max(100) foodSafetyScore?: number;
}

export class UpdateVendorVerificationDto extends PartialType(CreateVendorVerificationDto) {}

export class CertificateDto {
  @IsString() type: string; // SLHS | HALAL | HACCP | ISO22000
  @IsOptional() @IsString() nomor?: string;
  @IsOptional() @IsString() validUntil?: string;
  @IsOptional() @IsString() status?: string; // Valid | Proses | Kadaluarsa
}
