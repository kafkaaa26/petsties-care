import { PetTypeEnum } from '@core/enums/pet-type.enum';
import { ServiceTypeEnum } from '@core/enums/service-type.enum';
import { Trim } from '@core/utils/common';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReservationRequest {
  @IsNotEmpty()
  @IsEnum(PetTypeEnum)
  petType: PetTypeEnum;

  @IsNotEmpty()
  @IsEnum(ServiceTypeEnum)
  serviceType: ServiceTypeEnum;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  petState: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  userName: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  address: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  dateReservation: string;

  @IsNotEmpty()
  @IsString()
  @Transform((v) => Trim(v.value) || '')
  clinicId: string;
}
