import React, { FC, memo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Table, TableItem, Card } from '@honzon-platform/ui-components';
import { useAccounts, useConstants } from '@honzon-platform/react-hooks';

import { Token } from '../Token';
import { UserBalance } from '../UserBalance';
import { Price } from '../Price';
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
  const { active } = useAccounts();
  const { allCurrencyIds: allToken } = useConstants();

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
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId) => (
        <UserBalance
          token={token}
          withIcon={false}
        />
      ),
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

  return (
    <Card
      gutter={false}
      header={title || 'Wallet Balance'}
    >
      <Table
        config={tableConfig}
        data={allToken}
        showHeader={showHeader}
      />
    </Card>
  );
});

WalletBalanceCard.displayName = 'WalletbalanceCard';
