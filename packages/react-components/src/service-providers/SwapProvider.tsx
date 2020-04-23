import React, { memo, createContext, FC, PropsWithChildren, useState } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, calcTargetInOtherToBase, convertToFixed18, calcTargetInBaseToOther, calcTargetInOtherToOther, calcSupplyInOtherToBase, calcSupplyInBaseToOther, calcSupplyInOtherToOther } from '@acala-network/app-util';
import { useApi, useCall, useStateWithCallback } from '@honzon-platform/react-hooks';
import { DerivedDexPool } from '@acala-network/api-derive';

import { Vec } from '@polkadot/types';

interface ContextData {
  baseCurrency: CurrencyId;

  supplyCurrencies: (CurrencyId | string)[];
  supplyCurrency: CurrencyId;
  targetCurrencies: (CurrencyId | string)[];
  targetCurrency: CurrencyId;
  setSupplyCurrency: (currency: CurrencyId, callback?: (currency: CurrencyId) => void) => void;
  setTargetCurrency: (currency: CurrencyId, callback?: (curency: CurrencyId) => void) => void;

  slippage: number;
  setSlippage: (slippage: number) => void;

  calcSupply: (target: number, slippage?: number) => Promise<number>;
  calcTarget: (supply: number, slippage?: number) => Promise<number>;

  supplyPool: DerivedDexPool | undefined;
  targetPool: DerivedDexPool | undefined;
}

export const SwapContext = createContext<ContextData>({} as ContextData);

export const SwapProvider: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const { api } = useApi();
  const supplyCurrencies = (api.consts.dex.enabledCurrencyIds as Vec<CurrencyId>).toArray();
  const defaultSupplyCurrency = supplyCurrencies[0];
  const baseCurrency = api.consts.dex.getBaseCurrencyId as CurrencyId;
  const targetCurrencies = supplyCurrencies.slice();
  const feeRate = convertToFixed18(api.consts.dex.getExchangeFee);
  const [supplyCurrency, setSupplyCurrency] = useStateWithCallback<CurrencyId>(defaultSupplyCurrency);
  const [targetCurrency, setTargetCurrency] = useStateWithCallback<CurrencyId>(baseCurrency);
  const [slippage, setSlippage] = useStateWithCallback<number>(0.005);
  const supplyPool = useCall<DerivedDexPool>((api.derive as any).dex.pool, [supplyCurrency]);
  const targetPool = useCall<DerivedDexPool>((api.derive as any).dex.pool, [targetCurrency]);

  const convertPool = (origin: DerivedDexPool): { base: Fixed18; other: Fixed18 } => {
    return {
      base: convertToFixed18(origin.base),
      other: convertToFixed18(origin.other)
    };
  };

  const calcSupply = async (target: number, slippag?: number): Promise<number> => {
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

  const calcTarget = async (supply: number, slippage?: number): Promise<number> => {
    // reload supply pool and target pool
    const supplyPool = await (api.derive as any).dex.pool(supplyCurrency);
    const targetPool = await (api.derive as any).dex.pool(targetCurrency);

    if (!(supplyPool && targetPool)) {
      return '' as any as number;
    }

    console.log(supplyCurrency.toString(), targetCurrency.toString());

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
      setSupplyCurrency,
      setTargetCurrency,
      supplyCurrency,
      targetCurrency,
      slippage,
      supplyPool,
      targetPool
    }}>
      {children}
    </SwapContext.Provider>
  );
});

SwapProvider.displayName = 'SwapProvider';
