import { useCall } from './useCall';

import { CurrencyId } from '@acala-network/types/interfaces';
import { DerivedDexPool } from '@acala-network/api-derive';

import { useApi } from './useApi';

export const useDexPool = (token: CurrencyId | string): DerivedDexPool | undefined => {
  const { api } = useApi();
  // FIXME: need fix api-derive type
  const pool = useCall<DerivedDexPool>((api.derive as any).dex.pool, [token]);

  return pool;
};
