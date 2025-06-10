import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterRequest {
  @IsString()
  @IsNotEmpty()
  @Transform((v) => Trim(v.value) || '')
  userName: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  password: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  roleId: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  groupUserId: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  tenantId: string;
}
