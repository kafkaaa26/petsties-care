import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class ClinicRequest {
  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicName: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicAddress: string;

  @IsNotEmpty()
  @IsArray()
  @Transform((v) => v.value || [])
  clinicServices: Record<string, any>[];

  @IsOptional()
  @IsArray()
  @Transform((v) => v.value || [])
  pricePerService: Record<string, any>[];

  @IsNotEmpty()
  @IsObject()
  @Transform((v) => v.value || {})
  workingHours: Record<string, any>;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Transform((v) => v.value.map((item: string) => Trim(item)) || [])
  clinicSpecialties: string[];

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicPhone: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicEmail: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicDescription: string;

  @IsOptional()
  @IsNumber()
  rating: number = 5; // Default rating set to 5
}
