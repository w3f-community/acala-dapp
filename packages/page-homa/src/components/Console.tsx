import React, { FC, memo, ReactElement } from 'react';
import { Card, Tabs } from '@honzon-platform/ui-components';
import { StakingConsole } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';
import classes from './Console.module.scss';

export const Console: FC = memo(() => {
  const config = [
    {
      title: 'Mint & Stake',
      render: (): ReactElement => <StakingConsole />
    },
    {
      title: 'Redeem',
      render: (): ReactElement => <RedeemConsole />
    }
  ];

  return (
    <Card className={classes.root} >
      <Tabs config={config}
        style='bar' />
    </Card>
  );
});

Console.displayName = 'ConsoleController';
