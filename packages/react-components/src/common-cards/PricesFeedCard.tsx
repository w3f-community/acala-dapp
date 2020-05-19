import React, { FC, memo, ReactNode, useMemo } from 'react';

import { DerivedPrice } from '@acala-network/api-derive';
import { convertToFixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';
import { TimestampedValue } from '@open-web3/orml-types/interfaces';

import { Table, TableItem, Card } from '@acala-dapp/ui-components';
import { usePrice } from '@acala-dapp/react-hooks';

import { formatCurrency, getValueFromTimestampValue } from '../utils';
import { FormatFixed18 } from '../format';

type TableData = DerivedPrice;

export const PricesFeedCard: FC = memo(() => {
  const data = usePrice() as DerivedPrice[];

  const tableConfig: TableItem<TableData>[] = [
    {
      align: 'left',
      dataIndex: 'token',
      render (data: CurrencyId): ReactNode {
        return `${formatCurrency(data)} in USD`;
      },
      title: 'Currency'
    },
    {
      align: 'right',
      dataIndex: 'price',
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

  return useMemo(() => {
    return (
      <Card header='Price Feed'
        padding={false}>
        <Table
          config={tableConfig}
          data={data}
          size='small'
        />
      </Card>
    );
  }, [data, tableConfig]);
});

PricesFeedCard.displayName = 'PricesFeedCard';
