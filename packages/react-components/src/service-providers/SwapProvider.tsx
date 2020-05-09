import React, { memo, createContext, FC, PropsWithChildren, useState, useEffect, useCallback } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, calcTargetInOtherToBase, convertToFixed18, calcTargetInBaseToOther, calcTargetInOtherToOther, calcSupplyInOtherToBase, calcSupplyInBaseToOther, calcSupplyInOtherToOther } from '@acala-network/app-util';
import { useApi, useStateWithCallback, useConstants } from '@honzon-platform/react-hooks';
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
  dexBaseCurrency: CurrencyId;

  supplyCurrencies: (CurrencyId | string)[];
  targetCurrencies: (CurrencyId | string)[];

  calcSupply: (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, target: number, slippage?: number) => Promise<number>;
  calcTarget: (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, supply: number, slippage?: number) => Promise<number>;

  setCurrency: (target: CurrencyId, other: CurrencyId, callback?: (pool: PoolData) => void) => Promise<void>;
  pool: PoolData;
}

export const SwapContext = createContext<ContextData>({} as ContextData);

export const SwapProvider: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const { api } = useApi();
  const supplyCurrencies = (api.consts.dex.enabledCurrencyIds as Vec<CurrencyId>).toArray();
  const defaultSupplyCurrency = supplyCurrencies[0];
  const { dexBaseCurrency } = useConstants();
  const targetCurrencies = supplyCurrencies.slice();
  const feeRate = api.consts.dex.getExchangeFee;
  const [pool, setPool] = useState<PoolData>({
    supplyCurrency: defaultSupplyCurrency,
    supplySize: 0,
    targetCurrency: dexBaseCurrency,
    targetSize: 0
  });

  const setCurrency = useCallback(async (supply: CurrencyId, target: CurrencyId): Promise<void> => {
    // base to other
    if (tokenEq(supply, dexBaseCurrency) && !tokenEq(target, dexBaseCurrency)) {
      const pool = await (api.derive as any).dex.pool(target) as DerivedDexPool;

      setPool({
        supplyCurrency: supply,
        targetCurrency: target,
        supplySize: convertToFixed18(pool.base).toNumber(),
        targetSize: convertToFixed18(pool.other).toNumber()
      });
    }

    // other to base
    if (tokenEq(target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency)) {
      const pool = await (api.derive as any).dex.pool(supply) as DerivedDexPool;

      setPool({
        supplyCurrency: supply,
        targetCurrency: target,
        supplySize: convertToFixed18(pool.other).toNumber(),
        targetSize: convertToFixed18(pool.base).toNumber()
      });
    }

    // other to other
    if (!tokenEq(target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency)) {
      const supplyPool = await (api.derive as any).dex.pool(supply) as DerivedDexPool;
      const targetPool = await (api.derive as any).dex.pool(target) as DerivedDexPool;

      setPool({
        supplyCurrency: supply,
        targetCurrency: target,
        supplySize: convertToFixed18(targetPool.other).toNumber(),
        targetSize: convertToFixed18(supplyPool.other).toNumber()
      });
    }
  }, [api.derive, dexBaseCurrency, setPool]);

  useEffect(() => {
    setCurrency(pool.supplyCurrency, pool.targetCurrency);
  }, [pool.supplyCurrency, pool.targetCurrency, setCurrency]);

  const convertPool = (origin: DerivedDexPool): { base: Fixed18; other: Fixed18 } => {
    return {
      base: convertToFixed18(origin.base),
      other: convertToFixed18(origin.other)
    };
  };

  const calcSupply = async (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, target: number, slippage?: number): Promise<number> => {
    // reload supply pool and target pool
    const supplyPool = await (api.derive as any).dex.pool(supplyCurrency);
    const targetPool = await (api.derive as any).dex.pool(targetCurrency);

    if (!(supplyPool && targetPool)) {
      return '' as any as number;
    }

    if (!supplyCurrency.eq(dexBaseCurrency) && targetCurrency.eq(dexBaseCurrency)) {
      // other to base
      return calcSupplyInOtherToBase(
        Fixed18.fromNatural(target),
        convertPool(supplyPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    } else if (supplyCurrency.eq(dexBaseCurrency) && !targetCurrency.eq(dexBaseCurrency)) {
      return calcSupplyInBaseToOther(
        Fixed18.fromNatural(target),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    } else if (!supplyCurrency.eq(dexBaseCurrency) && !targetCurrency.eq(dexBaseCurrency)) {
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
    // reload supply pool and target pool
    const supplyPool = await (api.derive as any).dex.pool(supplyCurrency);
    const targetPool = await (api.derive as any).dex.pool(targetCurrency);

    if (!(supplyPool && targetPool)) {
      return '' as any as number;
    }

    if (!supplyCurrency.eq(dexBaseCurrency) && targetCurrency.eq(dexBaseCurrency)) {
      // other to base
      return calcTargetInOtherToBase(
        Fixed18.fromNatural(supply),
        convertPool(supplyPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    } else if (supplyCurrency.eq(dexBaseCurrency) && !targetCurrency.eq(dexBaseCurrency)) {
      return calcTargetInBaseToOther(
        Fixed18.fromNatural(supply),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage || 0)
      ).toNumber();
    } else if (!supplyCurrency.eq(dexBaseCurrency) && !targetCurrency.eq(dexBaseCurrency)) {
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

  targetCurrencies.push(dexBaseCurrency);
  supplyCurrencies.push(dexBaseCurrency);

  return (
    <SwapContext.Provider value={{
      dexBaseCurrency,
      calcSupply,
      calcTarget,
      supplyCurrencies,
      targetCurrencies,
      setCurrency,
      pool
    }}>
      {children}
    </SwapContext.Provider>
  );
});

SwapProvider.displayName = 'SwapProvider';
