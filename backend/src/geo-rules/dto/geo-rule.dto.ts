import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateGeoRuleDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  radiusKm?: number;

  @IsOptional()
  @IsNumber()
  centerLat?: number;

  @IsOptional()
  @IsNumber()
  centerLng?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
