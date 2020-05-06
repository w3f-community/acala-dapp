import { useApi } from './useApi';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Vec } from '@polkadot/types';
import { useRef } from 'react';

export const useConstants = () => {
  const { api } = useApi();

  // all currency ids
  const tokenList = api.registry.createType('CurrencyId' as any).defKeys as string[];
  const allCurrencyIds = useRef(tokenList.map((name: string): CurrencyId => {
    return api.registry.createType('CurrencyId' as any, name) as CurrencyId;
  }));
  const dexCurrencies = (api.consts.dex.enabledCurrencyIds as Vec<CurrencyId>);

  return {
    allCurrencyIds: allCurrencyIds.current,
    stableCurrency: api.consts.cdpEngine.getStableCurrencyId as CurrencyId,
    dexCurrencies,
    ...api.consts
  };
};
