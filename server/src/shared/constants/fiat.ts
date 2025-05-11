import { FiatEnum } from './enum';

export const FIAT_VALUES = {
  [FiatEnum.USD]: {
    code: FiatEnum.USD,
    name: 'USD',
    symbol: 'US$',
  },
  [FiatEnum.EUR]: {
    code: FiatEnum.EUR,
    name: 'EUR',
    symbol: '€',
  },
  [FiatEnum.MXN]: {
    code: FiatEnum.MXN,
    name: 'MXN',
    symbol: 'MEX$',
  },
};
