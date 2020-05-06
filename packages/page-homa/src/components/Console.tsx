import React, { FC, memo, ReactElement } from 'react';
import { Card, Tabs } from '@honzon-platform/ui-components';
import { StakingConsole } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';

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
    <Card>
      <Tabs config={config}
        style='bar' />
    </Card>
  );
});

Console.displayName = 'ConsoleController';
