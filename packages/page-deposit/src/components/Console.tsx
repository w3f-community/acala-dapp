import React, { FC, memo, useContext } from 'react';

import { DepositContext } from './Provider';
import { DepositConsole } from './DepositConsole';
import { WithdrawConsole } from './WithdrawConsole';
import { RewardConsole } from './RewardConsole';

export const Console: FC = () => {
  const { action } = useContext(DepositContext);

  if (action === 'deposit') {
    return <DepositConsole />;
  }

  if (action === 'withdraw') {
    return <WithdrawConsole />;
  }

  if (action === 'reward') {
    return <RewardConsole />;
  }

  return null;
};
