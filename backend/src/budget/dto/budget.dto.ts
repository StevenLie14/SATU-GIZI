import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';

export class CreateBudgetItemDto {
  @IsString() kategori: string;
  @IsString() item: string;
  @IsNumber() qty: number;
  @IsString() satuan: string;
  @IsNumber() hargaSatuan: number;
  @IsString() periode: string;
  @IsOptional() @IsEnum(ApprovalStatus) status?: ApprovalStatus;
}

export class UpdateBudgetItemDto extends PartialType(CreateBudgetItemDto) {}

export class SetApprovalDto {
  @IsEnum(ApprovalStatus) status: ApprovalStatus;
}
