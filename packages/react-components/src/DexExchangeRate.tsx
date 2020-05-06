import React, { FC, memo, useState, useEffect } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { FormatBalance } from '@honzon-platform/react-components';
import { useApi, useDexPool } from '@honzon-platform/react-hooks';
import { tokenEq } from './utils';

interface Props {
  supply: string | CurrencyId;
  target?: string | CurrencyId;
}

export const DexExchangeRate: FC<Props> = memo(({ supply, target }) => {
  const { api } = useApi();
  const baseCurrency = api.consts.dex.getBaseCurrencyId as CurrencyId;
  const _target = target || baseCurrency;
  const supplyPool = useDexPool(supply || null as any as CurrencyId);
  const targetPool = useDexPool(_target || null as any as CurrencyId);
  const [ratio, setRatio] = useState<Fixed18>(Fixed18.ZERO);
  const [supplyToken, setSupplyToken] = useState<CurrencyId | string>();
  const [targetToken, setTargetToken] = useState<CurrencyId | string>(baseCurrency);

  useEffect(() => {
    if (!supplyPool || !supply) {
      return;
    }

    if (tokenEq(supply, baseCurrency) && !tokenEq(_target, baseCurrency) && targetPool) {
      setRatio(Fixed18.fromRational(
        targetPool.base.toString(),
        targetPool.other.toString()
      ));
      setSupplyToken(target);
    }

    if (tokenEq(_target, baseCurrency) && !tokenEq(supply, baseCurrency) && supplyPool) {
      setRatio(Fixed18.fromRational(
        supplyPool.base.toString(),
        supplyPool.other.toString()
      ));
      setSupplyToken(supply);
    }

    if (!tokenEq(_target, baseCurrency) && !tokenEq(supply, baseCurrency) && supplyPool && targetPool) {
      setRatio(Fixed18.fromRational(
        Fixed18.fromRational(
          supplyPool.base.toString(),
          supplyPool.other.toString()
        ).toNumber(),
        Fixed18.fromRational(
          targetPool.base.toString(),
          targetPool.other.toString()
        ).toNumber()
      ));
      setSupplyToken(supply);
      setTargetToken(target || baseCurrency);
    }
  }, [supplyPool, targetPool, supply, target, baseCurrency, _target]);

  return (
    <FormatBalance
      pair={[
        { currency: supplyToken, balance: 1 },
        {
          currency: targetToken,
          balance: ratio
        }
      ]}
      pairSymbol='='
    />
  );
});

DexExchangeRate.displayName = 'DexExchangeRate';
