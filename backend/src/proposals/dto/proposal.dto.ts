import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';

export class CreateProposalDto {
  @IsString() judul: string;
  @IsString() pengaju: string;
  @IsString() periode: string;
  @IsNumber() nilai: number;
  @IsOptional() @IsString() tanggal?: string;
  @IsOptional() @IsEnum(ApprovalStatus) status?: ApprovalStatus;
}

export class UpdateProposalDto extends PartialType(CreateProposalDto) {}

export class SetProposalStatusDto {
  @IsEnum(ApprovalStatus) status: ApprovalStatus;
}
