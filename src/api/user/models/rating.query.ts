import { BaseQuery } from '@core/models/base.query';
import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RatingQuery extends BaseQuery {
  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicId: string;
}
