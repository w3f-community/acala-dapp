import React, { FC, memo, useContext } from 'react';
import { DropdownConfig, Dropdown } from '@honzon-platform/ui-components';

import { ReactComponent as DepositIcon } from '../assets/deposit.svg';
import { ReactComponent as WithdrawIcon } from '../assets/withdraw.svg';
import { ReactComponent as RewardIcon } from '../assets/reward.svg';
import { DepositContext } from './Provider';

export const SelectAction: FC = memo(() => {
  const { action, setActiveAction } = useContext(DepositContext);
  const config: DropdownConfig[] = [
    {
      value: 'deposit',
      render: () => (
        <>
          <DepositIcon />
          <span>Deposit Liquidity</span>
        </>
      )
    },
    {
      value: 'withdraw',
      render: () => (
        <>
          <WithdrawIcon />
          <span>Withdraw Liquidity</span>
        </>
      )
    },
    {
      value: 'reward',
      render: () => (
        <>
          <RewardIcon />
          <span>Withdraw System Reward</span>
        </>
      )
    }
  ];

  return (
    <Dropdown
      config={config}
      onChange={setActiveAction}
      placeholder=''
      value={action}
    />
  );
});
