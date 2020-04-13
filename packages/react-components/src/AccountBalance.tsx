import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { useAccounts } from '@honzon-platform/react-hooks';
import { QueryBalance } from '@honzon-platform/react-query';
import { FormatBalance } from './format';

interface Props {
  token: CurrencyId | string;
  account?: string;
}

export const AccountBalance: FC<Props> = memo(({ token, account }) => {
  const { active } = useAccounts();

  if (!(active || account)) {
    return null;
  }

  return (
    <QueryBalance 
      account={account ? account : active!.address}
      token={token}
      render={(result) => <FormatBalance balance={result} />}
    />
  );
})
