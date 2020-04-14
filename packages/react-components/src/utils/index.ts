import { Codec } from '@polkadot/types/types';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

export const formatCurrency = (currency: CurrencyId | string, upper = true): string => {
  const inner = currency.toString();

  return upper ? inner.toUpperCase() : inner;
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
