import React, { FC, memo, ReactElement } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Table, TableItem, Card, Button } from '@honzon-platform/ui-components';
import { useAccounts, useApi } from '@honzon-platform/react-hooks';

import { Token } from '../Token';
import { UserBalance } from '../UserBalance';
import { Price } from '../Price';
import { getAllCurrencyIds } from '../utils';
import { TransferButton } from '../TransferButton';

type TableData = CurrencyId[];

type TableShowCellType = 'token' | 'balance' | 'price' | 'amount' | 'action';

interface Props {
  title?: string;
  showHeader?: boolean;
  showCell?: TableShowCellType[];
}

export const WalletBalanceCard: FC<Props> = memo(({
  title,
  showHeader = false,
  showCell = ['token', 'balance', 'amount']
}) => {
  const { api } = useApi();
  const { active } = useAccounts();

  if (!active) {
    return null;
  }

  const _tableConfig: TableItem<TableData>[] = [
    {
      key: 'token',
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId) => <Token token={token} />,
      title: 'Token'
    },
    {
      key: 'balance',
      align: 'center',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId) => <UserBalance token={token} />,
      title: 'Balance'
    },
    {
      key: 'price',
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (token) => <Price token={token} />,
      title: 'Price'
    },
    {
      key: 'amount',
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId) => (
        <UserBalance
          token={token}
          withPrice
        />
      ),
      title: 'Amount'
    },
    {
      key: 'action',
      align: 'right',
      title: 'Action',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId) => <TransferButton token={token} />
    }
  ];
  const tableConfig = _tableConfig.filter((item) => showCell.includes(item.key!));
  const allToken = getAllCurrencyIds(api);

  return (
    <Card
      header={title || 'Wallet Balance'}
      gutter={false}
    >
      <Table
        showHeader={showHeader}
        config={tableConfig}
        data={allToken}
      />
    </Card>
  );
});

WalletBalanceCard.displayName = 'WalletbalanceCard';
