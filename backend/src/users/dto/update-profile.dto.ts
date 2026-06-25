import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() businessName?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() description?: string;
}
