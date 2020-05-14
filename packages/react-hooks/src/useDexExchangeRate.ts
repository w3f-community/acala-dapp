import { useMemo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { DerivedDexPool } from '@acala-network/api-derive';
import { Fixed18 } from '@acala-network/app-util';

import { useCall } from './useCall';

export const useDexExchangeRate = (token: CurrencyId) => {
  const pool = useCall<DerivedDexPool>('derive.dex.pool', [token]);

  const rate = useMemo(() => {
    if (!pool) {
      return Fixed18.ZERO;
    }

    return Fixed18.fromRational(
      pool.base.toString(),
      pool.other.toString()
    );
  }, [pool]);

  return rate;
};
