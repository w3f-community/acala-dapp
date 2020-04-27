import { Codec } from '@polkadot/types/types';
import * as dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';
import { ApiPromise } from '@polkadot/api';
import { TimestampedValue } from '@open-web3/orml-types/interfaces';

dayjs.extend(duration);

export const thousandth = (num: number): string => {
  return num.toLocaleString();
};

export const formatCurrency = (currency: CurrencyId | string, upper = true): string => {
  const inner = currency.toString();

  return upper ? inner.toUpperCase() : inner.toLowerCase();
};

export const formatBalance = (balance: Fixed18 | Codec | number): Fixed18 => {
  let inner = Fixed18.ZERO;

  if (typeof balance === 'number') {
    inner = Fixed18.fromNatural(balance);
  } else if (balance instanceof Fixed18) {
    inner = balance;
  } else {
    inner = Fixed18.fromParts(balance.toString());
  }

  return inner;
};

export const numToFixed18Inner = (num: number | string): string => {
  return Fixed18.fromNatural(num).innerToString();
};

export const tokenEq = (base: CurrencyId | string, target: CurrencyId | string): boolean => {
  if (!target || !base) {
    return false;
  }
  return base.toString().toUpperCase() === target.toString().toUpperCase();
};

// FIXME: a trick to get value from TimestampedValue, need to fix
export const getValueFromTimestampValue = (origin: TimestampedValue): Codec => {
  if (Reflect.has(origin.value, 'value')) {
    return (origin.value as any).value;
  }

  return origin.value;
};

export const getAllCurrencyIds = (api: ApiPromise): CurrencyId[] => {
  const tokenList = api.registry.createType('CurrencyId' as any).defKeys as string[];

  return tokenList.map((name: string): CurrencyId => {
    return api.registry.createType('CurrencyId' as any, name) as CurrencyId;
  });
};

export const getStableCurrencyId = (api: ApiPromise): CurrencyId => {
  return api.consts.cdpEngine.getStableCurrencyId as CurrencyId;
}

export const getCurrencyIdFromName = (api: ApiPromise, name: string): CurrencyId => {
  const CurrencyId = api.registry.createType('CurrencyId' as any);

  return new CurrencyId(name);
};

export const formtDuration = (duration: number): number => {
  const DAY =  1000 * 60 * 60 * 24;
  return Fixed18.fromRational(duration, DAY).toNumber();
}