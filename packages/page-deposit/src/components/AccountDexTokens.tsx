import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { FormatBalance } from '@honzon-platform/react-components';
import { QueryDexPool, QueryDexShare } from '@honzon-platform/react-query';
import { BareProps } from '@honzon-platform/ui-components/types';

interface Props extends BareProps{
  account: string;
  baseCurrencyId: CurrencyId;
  token: CurrencyId;
  withdraw?: number;
}

export const AccountDexTokens: FC<Props> = memo(({
  account,
  className,
  baseCurrencyId,
  token,
  withdraw
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
          let ratio = share.div(total);
          const withdrawShare = Fixed18.fromNatural(withdraw ? withdraw : 0);
          if (!withdrawShare.isZero()) {
            ratio = withdrawShare.div(total);
          }

          return (
            <FormatBalance
              className={className}
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
