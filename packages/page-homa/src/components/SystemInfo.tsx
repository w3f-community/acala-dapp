import React, { FC, useContext, ReactNode } from 'react';

import { Card, ListConfig, List } from '@honzon-platform/ui-components';
import { formatCurrency } from '@honzon-platform/react-components';
import { convertToFixed18 } from '@acala-network/app-util';
import { FormatFixed18 } from '@honzon-platform/react-components/format/FormatFixed18';

import { StakingPoolContext } from './StakingPoolProvider';

export const SystemInfo: FC = () => {
  const { stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

  const listConfig: ListConfig[] = [
    {
      key: 'liquidExchangeRate',
      title: `Exchange Rate (${formatCurrency(stakingPool.stakingCurrency)} / ${formatCurrency(stakingPool.liquidCurrency)})`,
      render: (data): ReactNode => <FormatFixed18 data={data} />
    },
    {
      key: 'maxRatio',
      title: 'Max Bonding Ratio',
      render: (data): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      )
    },
    {
      key: 'minRatio',
      title: 'Min Bonding Ratio',
      render: (data): ReactNode => (
        <FormatFixed18
          data={data}
          format='percentage'
        />
      )
    }
  ];

  const listData = {
    liquidExchangeRate: stakingPoolHelper?.liquidExchangeRate,
    maxRatio: convertToFixed18(stakingPool?.maxBondRatio || 0),
    minRatio: convertToFixed18(stakingPool?.minBondRatio || 0)
  };

  return (
    <Card padding={false}
      header='System Info'>
      <List config={listConfig}
        data={listData} />
    </Card>
  );
};
