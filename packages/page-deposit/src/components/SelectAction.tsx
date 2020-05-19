import React, { FC, memo, useContext, ReactNode } from 'react';
import { DropdownConfig, Dropdown } from '@acala-dapp/ui-components';

import { ReactComponent as DepositIcon } from '../assets/deposit.svg';
import { ReactComponent as WithdrawIcon } from '../assets/withdraw.svg';
import { ReactComponent as RewardIcon } from '../assets/reward.svg';
import { DepositContext } from './Provider';
import classes from './SelectAction.module.scss';

export const SelectAction: FC = memo(() => {
  const { action, setActiveAction } = useContext(DepositContext);
  const config: DropdownConfig[] = [
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactNode => (
        <>
          <DepositIcon />
          <span>Deposit Liquidity</span>
        </>
      ),
      value: 'deposit'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactNode => (
        <>
          <WithdrawIcon />
          <span>Withdraw Liquidity & Reward</span>
        </>
      ),
      value: 'withdraw'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactNode => (
        <>
          <RewardIcon />
          <span>Withdraw System Reward</span>
        </>
      ),
      value: 'reward'
    }
  ];

  return (
    <Dropdown
      className={classes.dropdown}
      config={config}
      onChange={setActiveAction}
      placeholder=''
      value={action}
    />
  );
});
