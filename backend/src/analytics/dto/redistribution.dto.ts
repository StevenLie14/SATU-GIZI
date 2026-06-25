import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRedistributionDto {
  @IsString() fromRegion: string;
  @IsString() toRegion: string;
  @IsString() komoditas: string;
  @IsNumber() jumlah: number;
  @IsString() satuan: string;
  @IsOptional() @IsString() jarak?: string;
  @IsOptional() @IsString() hemat?: string;
}
