import React, { FC, memo, ReactElement } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { useAccounts } from '@honzon-platform/react-hooks';
import { QueryBalance } from '@honzon-platform/react-query';
import { FormatBalance } from './format';

interface Props {
  token: CurrencyId | string;
  account?: string;
}

export const AccountBalance: FC<Props> = memo(({ account, token }) => {
  const { active } = useAccounts();

  if (!account) {
    account = active ? active.address : '';
  }

  if (!account) {
    return null;
  }

  return (
    <QueryBalance
      account={account}
      render={(result): ReactElement => <FormatBalance balance={result} />}
      token={token}
    />
  );
});

AccountBalance.displayName = 'AccountBalance';
