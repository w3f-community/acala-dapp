import React, { memo, createContext, FC, PropsWithChildren, useState, useEffect } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, calcTargetInOtherToBase, convertToFixed18, calcTargetInBaseToOther, calcTargetInOtherToOther, calcSupplyInOtherToBase, calcSupplyInBaseToOther, calcSupplyInOtherToOther } from '@acala-network/app-util';
import { useApi, useStateWithCallback } from '@honzon-platform/react-hooks';
import { DerivedDexPool } from '@acala-network/api-derive';

import { Vec } from '@polkadot/types';
import { tokenEq } from '../utils';

export interface PoolData {
  supplyCurrency: CurrencyId;
  targetCurrency: CurrencyId;
  supplySize: number;
  targetSize: number;
}

interface ContextData {
  baseCurrency: CurrencyId;

  supplyCurrencies: (CurrencyId | string)[];
  targetCurrencies: (CurrencyId | string)[];

  slippage: number;
  setSlippage: (slippage: number) => void;

  calcSupply: (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, target: number, slippage?: number) => Promise<number>;
  calcTarget: (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, supply: number, slippage?: number) => Promise<number>;

  setCurrency: (target: CurrencyId, slippage: CurrencyId, callback?: (pool: PoolData) => void) => Promise<void>;
  pool: PoolData;
}

export const SwapContext = createContext<ContextData>({} as ContextData);

export const SwapProvider: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const { api } = useApi();
  const supplyCurrencies = (api.consts.dex.enabledCurrencyIds as Vec<CurrencyId>).toArray();
  const defaultSupplyCurrency = supplyCurrencies[0];
  const baseCurrency = api.consts.dex.getBaseCurrencyId as CurrencyId;
  const targetCurrencies = supplyCurrencies.slice();
  const feeRate = convertToFixed18(api.consts.dex.getExchangeFee);
  const [slippage, setSlippage] = useStateWithCallback<number>(0.005);
  const [pool, setPool] = useStateWithCallback<PoolData>({
    supplyCurrency: defaultSupplyCurrency,
    supplySize: 0,
    targetCurrency: baseCurrency,
    targetSize: 0
  });

  const setCurrency = async (supply: CurrencyId, target: CurrencyId, callback?: () => void): Promise<void> => {
    // base to other
    if (tokenEq(supply, baseCurrency) && !tokenEq(target, baseCurrency)) {
      const pool = await (api.derive as any).dex.pool(target) as DerivedDexPool;
      setPool({
        supplyCurrency: supply,
        targetCurrency: target,
        supplySize: convertToFixed18(pool.base).toNumber(),
        targetSize: convertToFixed18(pool.other).toNumber(),
      }, callback);
    }

    // other to base
    if (tokenEq(target, baseCurrency) && !tokenEq(supply, baseCurrency)) {
      const pool = await (api.derive as any).dex.pool(supply) as DerivedDexPool;
      setPool({
        supplyCurrency: supply,
        targetCurrency: target,
        supplySize: convertToFixed18(pool.other).toNumber(),
        targetSize: convertToFixed18(pool.base).toNumber(),
      }, callback);
    }

    // other to other
    if (!tokenEq(target, baseCurrency) && !tokenEq(supply, baseCurrency)) {
      const supplyPool = await (api.derive as any).dex.pool(supply) as DerivedDexPool;
      const targetPool = await (api.derive as any).dex.pool(target) as DerivedDexPool;
      setPool({
        supplyCurrency: supply,
        targetCurrency: target,
        supplySize: convertToFixed18(targetPool.other).toNumber(),
        targetSize: convertToFixed18(supplyPool.other).toNumber(),
      }, callback);
    }
  };

  useEffect(() => {
    setCurrency(pool.supplyCurrency, pool.targetCurrency);
  }, []);

  const convertPool = (origin: DerivedDexPool): { base: Fixed18; other: Fixed18 } => {
    return {
      base: convertToFixed18(origin.base),
      other: convertToFixed18(origin.other)
    };
  };

  const calcSupply = async (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, target: number, slippag?: number): Promise<number> => {
    // reload supply pool and target pool
    const supplyPool = await (api.derive as any).dex.pool(supplyCurrency);
    const targetPool = await (api.derive as any).dex.pool(targetCurrency);

    if (!(supplyPool && targetPool)) {
      return '' as any as number;
    }

    if (!supplyCurrency.eq(baseCurrency) && targetCurrency.eq(baseCurrency)) {
      // other to base
      return calcSupplyInOtherToBase(
        Fixed18.fromNatural(target),
        convertPool(supplyPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    } else if (supplyCurrency.eq(baseCurrency) && !targetCurrency.eq(baseCurrency)) {
      return calcSupplyInBaseToOther(
        Fixed18.fromNatural(target),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    } else if (!supplyCurrency.eq(baseCurrency) && !targetCurrency.eq(baseCurrency)) {
      // other to other
      return calcSupplyInOtherToOther(
        Fixed18.fromNatural(target),
        convertPool(supplyPool),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    }

    return 0;
  };

  const calcTarget = async (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, supply: number, slippage?: number): Promise<number> => {
    console.log(targetCurrency.toString());
    // reload supply pool and target pool
    const supplyPool = await (api.derive as any).dex.pool(supplyCurrency);
    const targetPool = await (api.derive as any).dex.pool(targetCurrency);

    if (!(supplyPool && targetPool)) {
      return '' as any as number;
    }

    if (!supplyCurrency.eq(baseCurrency) && targetCurrency.eq(baseCurrency)) {
      // other to base
      return calcTargetInOtherToBase(
        Fixed18.fromNatural(supply),
        convertPool(supplyPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    } else if (supplyCurrency.eq(baseCurrency) && !targetCurrency.eq(baseCurrency)) {
      return calcTargetInBaseToOther(
        Fixed18.fromNatural(supply),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    } else if (!supplyCurrency.eq(baseCurrency) && !targetCurrency.eq(baseCurrency)) {
      // other to other
      return calcTargetInOtherToOther(
        Fixed18.fromNatural(supply),
        convertPool(supplyPool),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    }

    return 0;
  };

  targetCurrencies.push(baseCurrency);
  supplyCurrencies.push(baseCurrency);

  return (
    <SwapContext.Provider value={{
      baseCurrency,
      calcSupply,
      calcTarget,
      supplyCurrencies,
      targetCurrencies,
      setSlippage,
      slippage,
      setCurrency,
      pool
    }}>
      {children}
    </SwapContext.Provider>
  );
});

SwapProvider.displayName = 'SwapProvider';
