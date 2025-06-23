import { PetTypeEnum } from '@core/enums/pet-type.enum';
import { Currency } from './currency';
import * as iconv from 'iconv-lite';
import { ServiceTypeEnum } from '@core/enums/service-type.enum';

export const Trim = (raw: string): string => (raw ? raw.toString().trim() : '');

export const plus = (first: number, second: number): number => {
  return Number(Currency(first).plus(Currency(second)));
};

export const minus = (first: number, second: number): number => {
  return Number(Currency(first).minus(Currency(second)));
};

export const mul = (first: number, second: number): number => {
  return Number(Currency(first).mul(Currency(second)));
};

export const div = (first: number, second: number): number => {
  return Number(Currency(first).div(Currency(second)));
};

export const abs = (number: number): number => {
  return Number(Currency(number).abs());
};

export const normalizeVietnamese = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export const encodingFile = (data: string, encoding: string): any => {
  return iconv.encode(data, encoding);
};

export const getTextPetType = (petType: PetTypeEnum | string): string => {
  switch (petType) {
    case PetTypeEnum.DOG:
      return 'Chó';
    case PetTypeEnum.CAT:
      return 'Mèo';
    case PetTypeEnum.OTHER:
      return 'Thú cưng khác';
    default:
      return 'Thú cưng khác';
  }
};

export const getTextServiceType = (
  serviceType: ServiceTypeEnum | string,
): string => {
  switch (serviceType) {
    case ServiceTypeEnum.SPA:
      return 'Chăm sóc – Spa thú cưng';
    case ServiceTypeEnum.VACCINATION:
      return 'Tiêm phòng & phòng ngừa';
    case ServiceTypeEnum.TREATMENT:
      return 'Dịch vụ khám và điều trị';
    default:
      return 'Dịch vụ khác';
  }
};
