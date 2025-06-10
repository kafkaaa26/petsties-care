import { Currency } from './currency';

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
