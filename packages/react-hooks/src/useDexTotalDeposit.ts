import { useEffect, useState, useRef, useCallback } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useAccounts } from './useAccounts';
import { useConstants } from './useConstants';
import { usePrice } from './usePrice';
import { DerivedPrice, DerivedDexPool } from '@acala-network/api-derive';
import { tokenEq, getValueFromTimestampValue } from '@acala-dapp/react-components';

interface HooksReturnType {
  amount: Fixed18;
  token: CurrencyId;
}

export const useDexTotalDeposit = (): HooksReturnType => {
  const { api } = useApi();
  const { active } = useAccounts();
  const { dexCurrencies, stableCurrency } = useConstants();
  const deposits = useRef<{[k in string]: Fixed18}>({});
  const prices = usePrice() as DerivedPrice[];
  const [totalDeposit, setTotalDeposit] = useState<Fixed18>(Fixed18.ZERO);

  const calcTotalDeposit = useCallback(() => {
    const keys = Object.keys(deposits.current);
    const total = keys.reduce((acc, cur) => {
      if (deposits.current[cur]) {
        acc = acc.add(deposits.current[cur]);
      }

      return acc;
    }, Fixed18.ZERO);

    setTotalDeposit(total);
  }, [setTotalDeposit]);

  const getReward = useCallback((currency: CurrencyId) => {
    const _price = prices.find((item) => tokenEq(item.token, currency));
    const price = _price ? convertToFixed18(getValueFromTimestampValue(_price.price)) : Fixed18.fromNatural(1);

    (api.derive as any).dex.pool(currency, function (pool: DerivedDexPool) {
      api.query.dex.shares(currency, active?.address, function (_share) {
        api.query.dex.totalShares(currency, function (_totalShares) {
          const base = convertToFixed18(pool.base);
          const other = convertToFixed18(pool.other);
          const share = convertToFixed18(_share);
          const totalShares = convertToFixed18(_totalShares);
          const ratio = share.div(totalShares);

          deposits.current[currency.toString()] = base.mul(ratio).add(other.mul(ratio).mul(price));
          calcTotalDeposit();
        });
      });
    });
  }, [active, api.derive, api.query.dex, prices, calcTotalDeposit]);

  useEffect(() => {
    if (active && prices) {
      dexCurrencies.forEach((currency) => {
        getReward(currency);
      });
    }
  }, [api, active, prices, dexCurrencies, getReward]);

  return {
    amount: totalDeposit,
    token: stableCurrency
  };
};
