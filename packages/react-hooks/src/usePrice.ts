import { useMemo } from 'react';

import { DerivedPrice } from '@acala-network/api-derive';
import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';
import { TimestampedValue } from '@open-web3/orml-types/interfaces';

import { tokenEq, getValueFromTimestampValue } from '@honzon-platform/react-components';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useStakingPool } from './useStakingPool';
import { useDexExchangeRate } from './useDexExchangeRate';
import { useConstants } from './useConstants';

const insertPrice = (
  arr: DerivedPrice[],
  target: DerivedPrice
): DerivedPrice[] => {
  const index = arr.findIndex((item): boolean =>
    tokenEq(item.token, target.token)
  );

  if (index !== -1) {
    arr[index] = target;
  } else {
    arr.push(target);
  }

  return arr;
};

export const usePrice = (token?: CurrencyId | string): DerivedPrice[] | DerivedPrice | undefined => {
  const { api } = useApi();
  const { nativeCurrency } = useConstants();
  const _price = useCall<DerivedPrice[]>('derive.price.allPrices', []);
  const { stakingPool, stakingPoolHelper } = useStakingPool();
  const nativeCurrencyRate = useDexExchangeRate(nativeCurrency);

  const price = useMemo(() => {
    const price: DerivedPrice[] = [];
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const _TimestampedValue = api.registry.get('TimestampedValue')!;

    if (!_price) {
      return [];
    }

    _price.forEach((item): void => {
      price.push(item);
    });

    // native currency (ACA) price
    if (nativeCurrencyRate) {
      insertPrice(price, {
        price: (new _TimestampedValue(api.registry, {
          value: nativeCurrencyRate.innerToString()
        }) as TimestampedValue),
        token: nativeCurrency.toString()
      });
    }

    // L-DOT price
    if (stakingPool && stakingPoolHelper) {
      const stakingCurrencyPrice = _price.find((item) =>
        tokenEq(item.token, stakingPool.stakingCurrency)
      );
      const exchangeRate = stakingPoolHelper.liquidExchangeRate;

      if (stakingCurrencyPrice && exchangeRate) {
        const liquidPrice = convertToFixed18(
          getValueFromTimestampValue(stakingCurrencyPrice.price)
        ).mul(exchangeRate);

        insertPrice(price, {
          price: (new _TimestampedValue(api.registry, {
            value: liquidPrice.innerToString()
          }) as TimestampedValue),
          token: stakingPool.liquidCurrency.toString()
        });
      }
    }

    return price;
  }, [api.registry, _price, nativeCurrencyRate, stakingPool, stakingPoolHelper, nativeCurrency]);

  if (token && price) {
    return price.find((item: DerivedPrice) => item.token === token.toString());
  }

  return price;
};
