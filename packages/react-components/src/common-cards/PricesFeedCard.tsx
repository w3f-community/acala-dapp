import React, { FC, memo, ReactNode } from 'react';

import { DerivedPrice } from '@acala-network/api-derive';
import { convertToFixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';
import { TimestampedValue } from '@open-web3/orml-types/interfaces';

import { Table, TableItem, Card } from '@honzon-platform/ui-components';
import { usePrice } from '@honzon-platform/react-hooks';

import { formatCurrency, getValueFromTimestampValue } from '../utils';
import { FormatFixed18 } from '../format';

type TableData = DerivedPrice;

const PricesList: FC = () => {
  const data = usePrice() as DerivedPrice[];
  const tableConfig: TableItem<TableData>[] = [
    {
      dataIndex: 'token',
      render (data: CurrencyId): ReactNode {
        return `${formatCurrency(data)} in USD`;
      },
      align: 'left',
      title: 'Currency'
    },
    {
      dataIndex: 'price',
      align: 'right',
      render (data: TimestampedValue): ReactNode {
        return (
          <FormatFixed18
            data={convertToFixed18(getValueFromTimestampValue(data))}
            prefix='$'
            withPadEndDecimal
          />
        );
      },
      title: 'Price'
    }
  ];

  if (!data) {
    return null;
  }

  return (
    <Table
      config={tableConfig}
      data={data}
      size='small'
    />
  );
};

PricesList.displayName = 'PricesFeedCardList';

export const PricesFeedCard: FC = memo(() => {
  return (
    <Card padding={false}
      header='Price Feed'>
      <PricesList />
    </Card>
  );
});

PricesFeedCard.displayName = 'PricesFeedCard';
