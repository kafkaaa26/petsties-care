import { BaseQuery } from '@core/models/base.query';
import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UserQuery extends BaseQuery {
  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  userName: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  groupUserId: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  tenantId: string;
}
