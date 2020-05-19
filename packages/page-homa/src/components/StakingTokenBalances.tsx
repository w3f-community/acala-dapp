import React, { FC, useContext, ReactNode } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, Table, TableItem } from '@acala-dapp/ui-components';
import { Token, UserBalance } from '@acala-dapp/react-components';

import { StakingPoolContext } from './StakingPoolProvider';

interface TableData {
  token: CurrencyId;
}

export const StakingTokeBalances: FC = () => {
  const { stakingPool } = useContext(StakingPoolContext);

  const tableConfig: TableItem<TableData>[] = [
    {
      align: 'left',
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (data: CurrencyId): ReactNode => {
        return <Token token={data} />;
      },
      title: 'token'
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (data: TableData): ReactNode => <UserBalance token={data.token} />,
      title: 'balance'
    }
  ];

  if (!stakingPool) {
    return null;
  }

  const tableData = [
    { token: stakingPool.stakingCurrency },
    { token: stakingPool.liquidCurrency }
  ];

  return (
    <Card header='Balance'
      padding={false}>
      <Table config={tableConfig}
        data={tableData}
        size='small'
      />
    </Card>
  );
};
