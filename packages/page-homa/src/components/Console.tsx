import React, { FC, memo, ReactElement } from 'react';
import { Card, Tabs } from '@honzon-platform/ui-components';
import { StakingConsolee } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';

export const Console: FC = memo(() => {
  const config = [
    {
      title: 'Mint & Stake',
      render: (): ReactElement => <StakingConsolee />
    },
    {
      title: 'Redeem',
      render: (): ReactElement => <RedeemConsole />
    }
  ];

  return (
    <Card>
      <Tabs config={config} style='bar' />
    </Card>
  );
});

Console.displayName = 'ConsoleController';
