import React, { FC, memo, ReactNode, useEffect, useMemo } from 'react';

import { DerivedPrice } from '@acala-network/api-derive';
import { convertToFixed18 } from '@acala-network/app-util';
import { CurrencyId } from '@acala-network/types/interfaces';
import { TimestampedValue } from '@open-web3/orml-types/interfaces';

import { Table, TableItem, Card } from '@honzon-platform/ui-components';
import { usePrice } from '@honzon-platform/react-hooks';

import { formatCurrency, getValueFromTimestampValue } from '../utils';
import { FormatFixed18 } from '../format';

type TableData = DerivedPrice;

export const PricesFeedCard: FC = memo(() => {
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

  return useMemo(() => {
    return (
      <Card padding={false}
        header='Price Feed'>
        <Table
          config={tableConfig}
          data={data}
          size='small'
        />
      </Card>
    );
  }, [data]);
});

PricesFeedCard.displayName = 'PricesFeedCard';
