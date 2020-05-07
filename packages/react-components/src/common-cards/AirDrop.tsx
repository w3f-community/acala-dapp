import React, { FC } from 'react';
import { Card, TableItem, Table } from '@honzon-platform/ui-components';
import { useApi } from '@honzon-platform/react-hooks';
import { tokenEq } from '../utils';
import { AirDropAmount } from '../AirDropAmount';
import { AirDropCurrencyId } from '@acala-network/types/interfaces';

export const AirDrop: FC = () => {
  const { api } = useApi();
  const keys = (api.registry.createType('AirDropCurrencyId' as any) as AirDropCurrencyId).defKeys;
  const tableConfig: TableItem<string>[] = [
    {
      align: 'left',
      key: 'token',
      title: 'Token',
      render: (token: string) => tokenEq(token, 'ACA') ? `${token} (Mainnet)` : token
    },
    {
      align: 'right',
      key: 'balance',
      title: 'Balance',
      render: (token: string) => <AirDropAmount currency={token} />
    }
  ];

  return (
    <Card
      padding={false}
      header='AirDrop'
    >
      <Table<string[]>
        config={tableConfig}
        data={keys}
        showHeader
      />
    </Card>
  );
};
