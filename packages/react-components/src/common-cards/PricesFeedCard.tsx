import React, { FC, memo, ReactElement, ReactNode } from 'react';

import { DerivedPrice } from '@acala-network/api-derive';
import { TimestampedValue } from '@orml/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';
import { Codec } from '@polkadot/types/types';

import { QueryAllPrices } from '@honzon-platform/react-query';
import { Table, TableItem, Card } from '@honzon-platform/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { formatCurrency } from '../utils';
import { FormatFixed18 } from '../format';

interface Props {
  data: DerivedPrice[];
}

type TableData = DerivedPrice;

const PricesList: FC<Props> = memo(({ data }) => {
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

  return (
    <Table
      config={tableConfig}
      data={data}
    />
  );
});

PricesList.displayName = 'PricesFeedCardList';

export const PricesFeedCard: FC = memo(() => {
  return (
    <Card header='Price Feed'>
      <QueryAllPrices render={(result): ReactElement => {
        return <PricesList data={result}/>;
      }}/>
    </Card>
  );
});

PricesFeedCard.displayName = 'PricesFeedCard';
