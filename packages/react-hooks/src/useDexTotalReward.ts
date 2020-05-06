import { useEffect, useState, useRef, useCallback } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useAccounts } from './useAccounts';
import { useConstants } from './useConstants';

export const useDexTotalReward = () => {
  const { api } = useApi();
  const { active } = useAccounts();
  const { dexCurrencies, stableCurrency } = useConstants();
  const rewards = useRef<{[k in string]: Fixed18}>({});
  const [totalReward, setTotalReward] = useState<Fixed18>(Fixed18.ZERO);

  const getReward = useCallback((currency: CurrencyId) => {
    api.query.dex.totalInterest(currency, function (_totalInterest) {
      api.query.dex.withdrawnInterest(currency, active!.address, function (_withdrawnInterest) {
        api.query.dex.shares(currency, active!.address, function (_share) {
          api.query.dex.totalShares(currency, function (_totalShares) {
            const totalInterest = convertToFixed18(_totalInterest);
            const withdrawnInterest = convertToFixed18(_withdrawnInterest);
            const share = convertToFixed18(_share);
            const totalShares = convertToFixed18(_totalShares);
            const reward = totalInterest.mul(share.div(totalShares)).sub(withdrawnInterest);

            rewards.current[currency.toString()] = reward;
            calcTotalReward();
          });
        });
      });
    });
  }, [active, api.query.dex]);

  useEffect(() => {
    if (active) {
      dexCurrencies.forEach((currency) => {
        getReward(currency);
      });
    }
  }, [api, active, dexCurrencies, getReward]);

  const calcTotalReward = () => {
    const keys = Object.keys(rewards.current);
    const total = keys.reduce((acc, cur) => {
      if (rewards.current[cur]) {
        acc = acc.add(rewards.current[cur]);
      }

      return acc;
    }, Fixed18.ZERO);

    setTotalReward(total);
  };

  return {
    amount: totalReward,
    token: stableCurrency
  };
};

export const useDexTotalSystemReward = () => {
  const { api } = useApi();
  const { dexCurrencies, stableCurrency } = useConstants();
  const rewards = useRef<{[k in string]: Fixed18}>({});
  const [totalReward, setTotalReward] = useState<Fixed18>(Fixed18.ZERO);

  const getReward = useCallback((currency: CurrencyId) => {
    api.query.dex.totalInterest(currency, function (_totalInterest) {
      api.query.dex.totalWithdrawnInterest(currency, function (_withdrawnInterest) {
        const totalInterest = convertToFixed18(_totalInterest);
        const withdrawnInterest = convertToFixed18(_withdrawnInterest);
        const reward = totalInterest.sub(withdrawnInterest);

        rewards.current[currency.toString()] = reward;
        calcTotalReward();
      });
    });
  }, [api.query.dex]);

  useEffect(() => {
    dexCurrencies.forEach((currency) => {
      getReward(currency);
    });
  }, [api, dexCurrencies, getReward]);

  const calcTotalReward = () => {
    const keys = Object.keys(rewards.current);
    const total = keys.reduce((acc, cur) => {
      if (rewards.current[cur]) {
        acc = acc.add(rewards.current[cur]);
      }

      return acc;
    }, Fixed18.ZERO);

    setTotalReward(total);
  };

  return {
    amount: totalReward,
    token: stableCurrency
  };
};
