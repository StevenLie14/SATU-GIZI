import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateKitchenDto {
  @IsString() name: string;
  @IsNumber() latitude: number;
  @IsNumber() longitude: number;
  @IsString() address: string;
  @IsInt() capacity: number;
  @IsOptional() @IsString() kepala?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() phone?: string;
}

export class UpdateKitchenDto extends PartialType(CreateKitchenDto) {}

export class ChecklistItemDto {
  @IsString() label: string;
  @IsOptional() @IsBoolean() done?: boolean;
}

export class ToggleChecklistDto {
  @IsBoolean() done: boolean;
}

export class InspectionDto {
  @IsInt() @Min(0) @Max(100) score: number;
  @IsOptional() @IsString() report?: string;
  @IsOptional() @IsString() inspector?: string;
}

export class IssuePermitDto {
  @IsString() izinNomor: string;
  @IsString() izinBerlaku: string;
}
