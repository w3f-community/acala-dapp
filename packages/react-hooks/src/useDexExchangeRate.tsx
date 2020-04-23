import { useState, useEffect } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { DerivedDexPool } from '@acala-network/api-derive';
import { Fixed18 } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useCall } from './useCall';

export const useDexExchangeRate = (token: CurrencyId) => {
  const { api } = useApi();
  // FIXME: need fix api-derive type
  const pool = useCall<DerivedDexPool>((api.derive as any).dex.pool, [token]);
  const [rate, setRate] = useState<Fixed18>(Fixed18.ZERO);

  useEffect(() => {
    if (pool) {
      setRate( Fixed18.fromRational(
        pool.base.toString(),
        pool.other.toString()
      ));
    }
  }, [pool]);

  return { rate };
}