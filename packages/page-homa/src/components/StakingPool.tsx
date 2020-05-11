import React, { FC, useContext } from 'react';
import { Table, Card, TableItem } from '@honzon-platform/ui-components';
import { Token, FormatBalance, FormatFixed18 } from '@honzon-platform/react-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { StakingPoolContext } from './StakingPoolProvider';

export const StakingPool: FC = () => {
  const { rewardRate, stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);
  const tableConfig: TableItem<any>[] = [
    {
      align: 'left',
      title: 'Pool',
      dataIndex: 'token',
      render: (value: CurrencyId) => (
        <Token
          token={value}
          icon
        />
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (value: Fixed18) => <FormatBalance balance={value} />,
    },
    {
      title: 'Total Bonded',
      dataIndex: 'totalBonded',
      render: (value: Fixed18) => <FormatBalance balance={value} />,
    },
    {
      title: 'Total Free',
      dataIndex: 'totalFree',
      render: (value: Fixed18) => <FormatBalance balance={value} />,
    },
    {
      title: 'Unbonding',
      dataIndex: 'totalUnbonding',
      render: (value: Fixed18) => <FormatBalance balance={value} />,
    },
    {
      align: 'right',
      title: 'Bond Ratio',
      dataIndex: 'bondRatio',
      render: (value: Fixed18) => (
          <FormatFixed18
            data={value}
            format='percentage'
          />
        ),
    }
  ];
  const data = [
    {
      token: stakingPool?.stakingCurrency,
      total: stakingPoolHelper?.communalTotal,
      totalBonded: stakingPoolHelper?.totalBonded,
      totalFree: stakingPoolHelper?.communalFree,
      totalUnbonding: stakingPoolHelper?.unbondingToFree,
      bondRatio: stakingPoolHelper?.communalBondedRatio
    }
  ]
  return (
    <Card
      header='Staking Pools'
      padding={false}
    >
      <Table
        config={tableConfig}
        data={data}
        showHeader
      />
    </Card>
  );
}
