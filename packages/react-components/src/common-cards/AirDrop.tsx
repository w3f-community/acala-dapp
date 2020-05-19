import React, { FC, ReactNode } from 'react';
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
      render: (token: string): string => tokenEq(token, 'ACA') ? `${token} (Mainnet)` : token,
      title: 'Token'
    },
    {
      align: 'right',
      key: 'balance',
      /* eslint-disable-next-line react/display-name */
      render: (token: string): ReactNode => <AirDropAmount currency={token} />,
      title: 'Balance'
    }
  ];

  return (
    <Card
      header='AirDrop'
      padding={false}
    >
      <Table<string[]>
        config={tableConfig}
        data={keys}
        showHeader
      />
    </Card>
  );
};
