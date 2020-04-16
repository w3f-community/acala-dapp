import React, { memo, createContext, FC, PropsWithChildren, useState } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18, calcTargetInOtherToBase, convertToFixed18, calcTargetInBaseToOther, calcTargetInOtherToOther, calcSupplyInOtherToBase, calcSupplyInBaseToOther, calcSupplyInOtherToOther } from '@acala-network/app-util';
import { useApi, useCall } from '@honzon-platform/react-hooks';
import { DerivedDexPool } from '@acala-network/api-derive';

import { getAllCurrencyIds } from '../utils';

interface ContextData {
  baseCurrency: CurrencyId;

  supplyCurrency: CurrencyId;
  targetCurrency: CurrencyId;
  setSupplyCurrency: (currency: CurrencyId) => void;
  setTargetCurrency: (currency: CurrencyId) => void;

  slippage: number;
  setSlippage: (slippage: number) => void;

  calcSupply: (target: number) => number;
  calcTarget: (supply: number) => number;
}

export const SwapContext = createContext<ContextData>({} as ContextData);

export const SwapProvider: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const { api } = useApi();
  const allCurrencyIds = getAllCurrencyIds(api);
  // magic number 2 set dot as the default currency
  const defaultSupplyCurrency = allCurrencyIds[2];
  const baseCurrency = api.consts.dex.getBaseCurrencyId as CurrencyId;
  const feeRate = convertToFixed18(api.consts.dex.getExchangeFee);
  const [supplyCurrency, setSupplyCurrency] = useState<CurrencyId>(defaultSupplyCurrency);
  const [targetCurrency, setTargetCurrency] = useState<CurrencyId>(baseCurrency);
  const [slippage, setSlippage] = useState<number>(0.005);
  const supplyPool = useCall<DerivedDexPool>((api.derive as any).dex.pool, [supplyCurrency]);
  const targetPool = useCall<DerivedDexPool>((api.derive as any).dex.pool, [targetCurrency]);

  const convertPool = (origin: DerivedDexPool): { base: Fixed18; other: Fixed18 } => {
    return {
      base: convertToFixed18(origin.base),
      other: convertToFixed18(origin.other)
    };
  };

  const calcSupply = (target: number): number => {
    if (!(supplyPool && targetPool)) {
      return '' as any as number;
    }

    if (!supplyCurrency.eq(baseCurrency) && targetCurrency.eq(baseCurrency)) {
      // other to base
      return calcSupplyInOtherToBase(
        Fixed18.fromNatural(target),
        convertPool(supplyPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage)
      ).toNumber();
    } else if (supplyCurrency.eq(baseCurrency) && !targetCurrency.eq(baseCurrency)) {
      return calcSupplyInBaseToOther(
        Fixed18.fromNatural(target),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage)
      ).toNumber();
    } else if (!supplyCurrency.eq(baseCurrency) && !targetCurrency.eq(baseCurrency)) {
      // other to other
      return calcSupplyInOtherToOther(
        Fixed18.fromNatural(target),
        convertPool(supplyPool),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage)
      ).toNumber();
    }

    return 0;
  };

  const calcTarget = (supply: number): number => {
    if (!(supplyPool && targetPool)) {
      return '' as any as number;
    }

    if (!supplyCurrency.eq(baseCurrency) && targetCurrency.eq(baseCurrency)) {
      // other to base
      return calcTargetInOtherToBase(
        Fixed18.fromNatural(supply),
        convertPool(supplyPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage)
      ).toNumber();
    } else if (supplyCurrency.eq(baseCurrency) && !targetCurrency.eq(baseCurrency)) {
      return calcTargetInBaseToOther(
        Fixed18.fromNatural(supply),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage)
      ).toNumber();
    } else if (!supplyCurrency.eq(baseCurrency) && !targetCurrency.eq(baseCurrency)) {
      // other to other
      return calcTargetInOtherToOther(
        Fixed18.fromNatural(supply),
        convertPool(supplyPool),
        convertPool(targetPool),
        convertToFixed18(feeRate),
        Fixed18.fromNatural(slippage)
      ).toNumber();
    }

    return 0;
  };

  return (
    <SwapContext.Provider value={
      {
        baseCurrency,
        calcSupply,
        calcTarget,
        setSlippage,
        setSupplyCurrency,
        setTargetCurrency,
        supplyCurrency,
        targetCurrency
      } as any
    }>
      {children}
    </SwapContext.Provider>
  );
});

SwapProvider.displayName = 'SwapProvider';
