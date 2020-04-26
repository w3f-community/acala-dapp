import React, { FC, memo } from 'react';

import { CurrencyId, AccountId } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

import { FormatBalance } from '@honzon-platform/react-components';
import { BareProps } from '@honzon-platform/ui-components/types';
import { useDexPool, useDexShare } from '@honzon-platform/react-hooks';

interface Props extends BareProps {
  account?: AccountId | string;
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
  const pool = useDexPool(token);
  const { share, totalShares }= useDexShare(token, account);

  if (!pool || !share || !totalShares) {
    return null;
  }

  const otherPool = convertToFixed18(pool.other);
  const basePool = convertToFixed18(pool.base);
  const _total = convertToFixed18(totalShares);
  const _share = convertToFixed18(share);
  const withdrawShare = Fixed18.fromNatural(withdraw ? withdraw : 0);
  let ratio = _share.div(_total);

  if (!withdrawShare.isZero()) {
    ratio = withdrawShare.div(_total);
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
});

AccountDexTokens.displayName = 'AccountDexTokens';
