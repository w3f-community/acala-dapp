import { useEffect, useState, useCallback } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useAccounts } from './useAccounts';
import { useConstants } from './useConstants';

const calcTotalReward = (rewards: Fixed18[], callback: (result: Fixed18) => void): void => {
  const total = rewards.reduce((acc, cur) => {
    return acc.add(cur);
  }, Fixed18.ZERO);

  callback(total);
};

interface HooksReturnType {
  amount: Fixed18;
  token: CurrencyId;
}

export const useDexTotalReward = (): HooksReturnType => {
  const { api } = useApi();
  const { active } = useAccounts();
  const { dexCurrencies, stableCurrency } = useConstants();
  const [totalReward, setTotalReward] = useState<Fixed18>(Fixed18.ZERO);

  const getReward = useCallback(async (currency: CurrencyId) => {
    const _totalInterest = await api.query.dex.totalInterest(currency);
    const _withdrawnInterest = await api.query.dex.withdrawnInterest(currency, active?.address);
    const _share = await api.query.dex.shares(currency, active?.address);
    const _totalShares = await api.query.dex.totalShares(currency);
    const totalInterest = convertToFixed18(_totalInterest);
    const withdrawnInterest = convertToFixed18(_withdrawnInterest);
    const share = convertToFixed18(_share);
    const totalShares = convertToFixed18(_totalShares);
    const reward = totalInterest.mul(share.div(totalShares)).sub(withdrawnInterest);

    return reward;
  }, [active?.address, api.query.dex]);

  const run = useCallback(() => {
    api.rpc.chain.subscribeNewHeads(async () => {
      const result = await Promise.all(dexCurrencies.map(getReward));

      calcTotalReward(result, (total) => setTotalReward(total));
    });
  }, [api, dexCurrencies, getReward, setTotalReward]);

  useEffect(() => {
    if (api && active) {
      run();
    }
  }, [api, active, run]);

  return {
    amount: totalReward,
    token: stableCurrency
  };
};

export const useDexTotalSystemReward = (): HooksReturnType => {
  const { api } = useApi();
  const { dexCurrencies, stableCurrency } = useConstants();
  const [totalReward, setTotalReward] = useState<Fixed18>(Fixed18.ZERO);

  const getReward = useCallback(async (currency: CurrencyId) => {
    const _totalInterest = await api.query.dex.totalInterest(currency);
    const _withdrawnInterest = await api.query.dex.totalWithdrawnInterest(currency);
    const totalInterest = convertToFixed18(_totalInterest);
    const withdrawnInterest = convertToFixed18(_withdrawnInterest);
    const reward = totalInterest.sub(withdrawnInterest);

    return reward;
  }, [api.query.dex]);

  const run = useCallback(() => {
    api.rpc.chain.subscribeNewHeads(async () => {
      const result = await Promise.all(dexCurrencies.map(getReward));

      calcTotalReward(result, (total) => setTotalReward(total));
    });
  }, [api, dexCurrencies, getReward, setTotalReward]);

  useEffect(() => {
    if (api) {
      run();
    }
  }, [api, run]);

  return {
    amount: totalReward,
    token: stableCurrency
  };
};
