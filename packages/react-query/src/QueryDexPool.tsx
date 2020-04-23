import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BaseQueryElementProps } from './type';
import { DerivedDexPool } from '@acala-network/api-derive';
import { useApi, useCall } from '@honzon-platform/react-hooks';

interface Props extends BaseQueryElementProps<DerivedDexPool> {
  token: string | CurrencyId;
}

export const QueryDexPool: FC<Props> = memo(({ token, render }) => {
  const { api } = useApi();
  // FIXME: need fix api-derive type
  const pool = useCall<DerivedDexPool>((api.derive as any).dex.pool, [token]);

  if (pool) {
    return render(pool);
  }

  return null;
});

QueryDexPool.displayName = 'QueryDexPool';
