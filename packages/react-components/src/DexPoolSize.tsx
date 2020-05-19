import React, { FC } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { FormatBalance } from '@honzon-platform/react-components';
import { useDexPool, useConstants } from '@honzon-platform/react-hooks';

interface Props {
  token: string | CurrencyId;
}

export const DexPoolSize: FC<Props> = ({ token }) => {
  const { dexBaseCurrency } = useConstants();
  const pool = useDexPool(token);

  if (!pool) {
    return null;
  }

  return (
    <FormatBalance
      pair={[
        {
          balance: pool.other,
          currency: token
        },
        {
          balance: pool.base,
          currency: dexBaseCurrency
        }
      ]}
      pairSymbol='/'
    />
  );
};
