import React, { FC, useContext } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, Table, TableItem } from "@honzon-platform/ui-components";
import { StakingPoolContext, Token, AccountBalance  } from "@honzon-platform/react-components";

interface TableData {
  token: CurrencyId;
}

export const StakingTokeBalances: FC = () => {
    const { stakingPool } = useContext(StakingPoolContext);

    const tableConfig: TableItem<TableData>[] = [
      {
        title: 'type',
        render: (data: TableData) => {
          if (data.token.eq(stakingPool.liquidCurrency)) {
            return 'Liquid Token'
          }
          return 'Staking Token'
        }
      },
      {
        title: 'token',
        dataIndex: 'token',
        render: (data: CurrencyId) => {
          return <Token currency={data} />
        }
      },
      {
        title: 'balance',
        render: (data: TableData) => <AccountBalance token={data.token} />
      }
    ];
    const tableData = [
      { token: stakingPool.stakingCurrency },
      { token: stakingPool.liquidCurrency }
    ];

    if (!stakingPool) {
      return null;
    }

    return (
        <Card size="large" elevation={1} header='Balance' divider={true}>
          <Table config={tableConfig} data={tableData} />
        </Card>
    );
}
