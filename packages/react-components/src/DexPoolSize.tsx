import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { FormatBalance } from '@honzon-platform/react-components';
import { useApi, useDexPool } from '@honzon-platform/react-hooks';

interface Props {
  token: string | CurrencyId;
}

export const DexPoolSize: FC<Props> = memo(({ token }) => {
  const { api } = useApi();
  const baseCurrency = api.consts.dex.getBaseCurrencyId as CurrencyId;
  const pool = useDexPool(token);

  if (!pool) {
    return null;
  }

  return (
    <FormatBalance
      pair={[
        { currency: token, balance: pool.other },
        { currency: baseCurrency, balance: pool.base }
      ]}
      pairSymbol='/'
    />
  );
});

DexPoolSize.displayName = 'DexPoolSize';
