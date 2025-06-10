import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RatingRequest {
  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicId: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  userName: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform((v) => Number(v.value) || 5)
  rating: number;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  experienceDate: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  phoneNumber: string;
}
