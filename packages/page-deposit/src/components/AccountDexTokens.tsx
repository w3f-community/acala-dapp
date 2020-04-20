import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';

import { FormatBalance } from '@honzon-platform/react-components';
import { QueryDexPool, QueryDexShare } from '@honzon-platform/react-query';

interface Props {
  token: CurrencyId;
  account: string;
  baseCurrencyId: CurrencyId;
}
export const AccountDexTokens: FC<Props> = memo(({
  account,
  baseCurrencyId,
  token
}) => {
  return (
    <QueryDexPool
    token={token}
    render={(pool) => (
      <QueryDexShare 
        token={token}
        account={account}
        render={(result) => {
          const otherPool = convertToFixed18(pool.other);
          const basePool = convertToFixed18(pool.base);
          const total = convertToFixed18(result.totalShare);
          const share = convertToFixed18(result.share);
          const ratio = share.div(total);
          return (
            <FormatBalance
              pair={[
                { currency: token, balance: otherPool.mul(ratio) },
                { currency: baseCurrencyId, balance: basePool.mul(ratio) }
              ]}
              pairSymbol='+'
            />
          );
        }}
      />
    )}
  />
  );
});

AccountDexTokens.displayName = 'AccountDexTokens';
