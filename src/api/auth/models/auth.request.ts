import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRequest {
  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value))
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value))
  password: string;
}
