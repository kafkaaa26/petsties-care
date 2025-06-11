import { BaseQuery } from '@core/models/base.query';
import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ClinicQuery extends BaseQuery {
  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  county: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicId: string;
}
