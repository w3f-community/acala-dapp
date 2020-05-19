import React, { FC, memo } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId } from '@acala-network/types/interfaces';
import { useDexReward } from '@acala-dapp/react-hooks';
import { FormatBalance } from './format';

interface Props {
  account?: AccountId | string;
  token: CurrencyId | string;
}

export const DexReward: FC<Props> = memo(({
  account,
  token
}) => {
  const reward = useDexReward(token, account);

  return (
    <FormatBalance
      balance={reward.amount}
      currency={reward.token}
    />
  );
});

DexReward.displayName = 'DexRward';
