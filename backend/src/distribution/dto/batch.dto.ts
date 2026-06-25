import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DistributionStage } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class CreateBatchDto {
  @IsOptional() @IsString() kode?: string;
  @IsInt() porsi: number;
  @IsString() menu: string;
  @IsOptional() @IsString() driver?: string;
  @IsOptional() @IsString() kitchenId?: string;
  @IsOptional() @IsString() schoolId?: string;
  @IsOptional() @IsString() suhu?: string;
  @IsOptional() @IsString() berangkat?: string;
  @IsOptional() @IsString() estimasi?: string;
  @IsOptional() @IsEnum(DistributionStage) stage?: DistributionStage;
}

export class UpdateBatchDto extends PartialType(CreateBatchDto) {}

export class QueryBatchDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(DistributionStage) stage?: DistributionStage;
}
