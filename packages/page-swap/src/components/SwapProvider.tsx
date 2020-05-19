import React, { memo, createContext, FC, PropsWithChildren, useState, useEffect, useCallback, useMemo } from 'react';

import { Vec } from '@polkadot/types';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, calcTargetInOtherToBase, convertToFixed18, calcTargetInBaseToOther, calcTargetInOtherToOther, calcSupplyInOtherToBase, calcSupplyInBaseToOther, calcSupplyInOtherToOther } from '@acala-network/app-util';
import { DerivedDexPool } from '@acala-network/api-derive';

import { useApi, useConstants, useInitialize } from '@honzon-platform/react-hooks';
import { tokenEq } from '@honzon-platform/react-components';
import { PageLoading } from '@honzon-platform/ui-components';

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

  isInitialized: boolean;
}

const convertPool = (origin: DerivedDexPool): { base: Fixed18; other: Fixed18 } => {
  return {
    base: convertToFixed18(origin.base),
    other: convertToFixed18(origin.other)
  };
};

export const SwapContext = createContext<ContextData>({} as ContextData);

export const SwapProvider: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const { api } = useApi();
  const { isInitialized, setEnd } = useInitialize();
  const { dexBaseCurrency } = useConstants();

  const supplyCurrencies = useMemo(() => {
    const result = (api.consts.dex.enabledCurrencyIds as Vec<CurrencyId>).toArray();

    result.push(dexBaseCurrency);

    return result;
  }, [api.consts.dex.enabledCurrencyIds, dexBaseCurrency]);

  const targetCurrencies = useMemo(() => supplyCurrencies.slice(), [supplyCurrencies]);

  const defaultSupplyCurrency = useMemo(() => supplyCurrencies[0], [supplyCurrencies]);

  const feeRate = useMemo(() => api.consts.dex.getExchangeFee, [api]);

  const [pool, setPool] = useState<PoolData>({
    supplyCurrency: '' as any as CurrencyId,
    supplySize: 0,
    targetCurrency: '' as any as CurrencyId,
    targetSize: 0
  });

  const setCurrency = useCallback(async (supply: CurrencyId, target: CurrencyId): Promise<void> => {
    // base to other
    if (tokenEq(supply, dexBaseCurrency) && !tokenEq(target, dexBaseCurrency)) {
      const pool = await (api.derive as any).dex.pool(target) as DerivedDexPool;

      setPool({
        supplyCurrency: supply,
        supplySize: convertToFixed18(pool.base).toNumber(),
        targetCurrency: target,
        targetSize: convertToFixed18(pool.other).toNumber()
      });
    }

    // other to base
    if (tokenEq(target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency)) {
      const pool = await (api.derive as any).dex.pool(supply) as DerivedDexPool;

      setPool({
        supplyCurrency: supply,
        supplySize: convertToFixed18(pool.other).toNumber(),
        targetCurrency: target,
        targetSize: convertToFixed18(pool.base).toNumber()
      });
    }

    // other to other
    if (!tokenEq(target, dexBaseCurrency) && !tokenEq(supply, dexBaseCurrency)) {
      const supplyPool = await (api.derive as any).dex.pool(supply) as DerivedDexPool;
      const targetPool = await (api.derive as any).dex.pool(target) as DerivedDexPool;

      setPool({
        supplyCurrency: supply,
        supplySize: convertToFixed18(targetPool.other).toNumber(),
        targetCurrency: target,
        targetSize: convertToFixed18(supplyPool.other).toNumber()
      });
    }

    if (tokenEq(supply, dexBaseCurrency) && tokenEq(target, dexBaseCurrency)) {
      setPool({
        supplyCurrency: supply,
        supplySize: 0,
        targetCurrency: target,
        targetSize: 0
      });
    }
  }, [api.derive, dexBaseCurrency, setPool]);

  const calcSupply = useCallback(async (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, target: number, slippage?: number): Promise<number> => {
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
  }, [api.derive, dexBaseCurrency, feeRate]);

  const calcTarget = useCallback(async (supplyCurrency: CurrencyId, targetCurrency: CurrencyId, supply: number, slippage?: number): Promise<number> => {
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
  }, [api.derive, dexBaseCurrency, feeRate]);

  useEffect(() => {
    if (pool.supplyCurrency && !isInitialized) {
      setEnd();
    }
  }, [isInitialized, pool, setEnd]);

  useEffect(() => {
    setCurrency(defaultSupplyCurrency, dexBaseCurrency);
  }, [defaultSupplyCurrency, dexBaseCurrency, setCurrency]);

  return (
    <SwapContext.Provider value={{
      calcSupply,
      calcTarget,
      dexBaseCurrency,
      isInitialized,
      pool,
      setCurrency,
      supplyCurrencies,
      targetCurrencies
    }}>
      {
        isInitialized ? children : <PageLoading />
      }
    </SwapContext.Provider>
  );
});

SwapProvider.displayName = 'SwapProvider';
