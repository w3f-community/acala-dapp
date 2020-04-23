import React, { FC, memo, ReactElement, ReactNode } from 'react';

import { DerivedPrice } from '@acala-network/api-derive';
import { TimestampedValue } from '@orml/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';
import { Codec } from '@polkadot/types/types';
import { CurrencyId } from '@acala-network/types/interfaces';

import { QueryAllPrices } from '@honzon-platform/react-query';
import { Table, TableItem, Card } from '@honzon-platform/ui-components';
import { usePrice } from '@honzon-platform/react-hooks';

import { formatCurrency } from '../utils';
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
      title: 'Currency'
    },
    {
      dataIndex: 'price',
      render (data: TimestampedValue): ReactNode {
        let _value: Codec = data.value;

        if (Reflect.has(data.value, 'value')) {
          _value = (data.value as any).value as Codec;
        }

        return <FormatFixed18 data={convertToFixed18(_value)} />;
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
    />
  );
};

PricesList.displayName = 'PricesFeedCardList';

export const PricesFeedCard: FC = memo(() => {
  return (
    <Card header='Price Feed'>
      <PricesList />;
    </Card>
  );
});

PricesFeedCard.displayName = 'PricesFeedCard';
