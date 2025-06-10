import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserRequest {
  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  userName: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  email: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  groupUserId: string[];

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  roleId: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  tenantId: string;
}
