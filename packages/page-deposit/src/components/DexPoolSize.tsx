import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { QueryDexPool } from '@honzon-platform/react-query';
import { FormatBalance } from '@honzon-platform/react-components';

interface Props {
  token: CurrencyId;
  baseCurrencyId: CurrencyId;
}
export const DexPoolSize: FC<Props> = memo(({
  baseCurrencyId,
  token
}) => {
  return (
    <QueryDexPool
      token={token}
      render={(result) => (
        <FormatBalance
          pair={[
            { currency: token, balance: result.other },
            { currency: baseCurrencyId, balance: result.base }
          ]} 
          pairSymbol='/'
        />
      )}
    />
  );
});

DexPoolSize.displayName = 'DexPoolSize';
