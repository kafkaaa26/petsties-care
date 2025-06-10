import { BigSource, Big } from 'big.js';

export const Currency = (value: BigSource): Big => Big(value || '0');
