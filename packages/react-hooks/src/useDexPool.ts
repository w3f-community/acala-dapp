import { useCall } from './useCall';

import { CurrencyId } from '@acala-network/types/interfaces';
import { DerivedDexPool } from '@acala-network/api-derive';

export const useDexPool = (token: CurrencyId | string): DerivedDexPool | undefined => {
  const pool = useCall<DerivedDexPool>('derive.dex.pool', [token]);

  return pool;
};
