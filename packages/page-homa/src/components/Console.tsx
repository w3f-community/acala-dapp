import React, { FC, memo } from 'react';
import { Card, Tabs } from '@honzon-platform/ui-components';
import { StakingConsolee } from './StakingConsole';
import { RedeemConsole } from './RedeemConsole';

export const Console: FC = memo(() => {
  const config = [
    {
      title: 'Mint & Stake',
      render: () => {
        return <StakingConsolee />;
      }
    },
    {
      title: 'Redeem',
      render: () => {
        return <RedeemConsole />
      }
    }
  ];

  return (
    <Card>
      <Tabs config={config} style='bar' />
    </Card>
  );
});

Console.displayName = 'ConsoleController';
