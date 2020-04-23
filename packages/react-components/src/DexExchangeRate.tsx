import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { FormatBalance } from '@honzon-platform/react-components';
import { useApi, useDexPool } from '@honzon-platform/react-hooks';

interface Props {
  token: string | CurrencyId;
}

export const DexExchangeRate: FC<Props> = memo(({ token }) => {
  const { api } = useApi();
  const baseCurrency = api.consts.dex.getBaseCurrencyId as CurrencyId;
  const pool = useDexPool(token);

  if (!pool) {
    return null;
  }

  return (
    <FormatBalance
      pair={[
        { currency: token, balance: 1 },
        {
          currency: baseCurrency,
          balance: Fixed18.fromRational(
            pool.base.toString(),
            pool.other.toString()
          )
        }
      ]}
      pairSymbol='='
    />
  );
});

DexExchangeRate.displayName = 'DexExchangeRate';
