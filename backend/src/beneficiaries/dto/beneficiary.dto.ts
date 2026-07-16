import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBeneficiaryDto {
  @IsString() name: string;
  @IsNumber() latitude: number;
  @IsNumber() longitude: number;
  @IsString() address: string;
  @IsInt() capacity: number;
  @IsOptional() @IsString() jenjang?: string; // PAUD | SD | SMP | SMA
  @IsOptional() @IsInt() students?: number;
  @IsOptional() @IsString() kitchenId?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() phone?: string;
}

export class UpdateBeneficiaryDto extends PartialType(CreateBeneficiaryDto) {}

export class RecommendKitchenQueryDto {
  @Type(() => Number) @IsNumber() lat: number;
  @Type(() => Number) @IsNumber() lng: number;
}
