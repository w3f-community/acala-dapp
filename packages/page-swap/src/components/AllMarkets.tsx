import React, { FC, useContext, ReactNode } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Section, Card, Table, TableItem } from '@honzon-platform/ui-components';
import { Token, DexExchangeRate, DexPoolSize } from '@honzon-platform/react-components';

import { SwapContext } from './SwapProvider';

export const AllMarkets: FC = () => {
  const { dexBaseCurrency, supplyCurrencies } = useContext(SwapContext);
  const _supplyCurrencies = supplyCurrencies.filter((item: string | CurrencyId) => item.toString() !== dexBaseCurrency.toString());
  const tableConfig: TableItem<string | CurrencyId>[] = [
    {
      title: 'Token Pair',
      align: 'left',
      render: (token: string | CurrencyId): ReactNode => (
        <Token
          icon
          token={token}
        />
      )
    },
    {
      title: 'Market Price',
      align: 'left',
      render: (token: string | CurrencyId): ReactNode => <DexExchangeRate supply={token} />
    },
    {
      title: 'Pool Size',
      align: 'left',
      render: (token: string | CurrencyId): ReactNode => <DexPoolSize token={token} />
    }
  ];

  return (
    <Section title='All Markets'>
      <Card padding={false}>
        <Table
          config={tableConfig}
          data={_supplyCurrencies}
          showHeader
        />
      </Card>
    </Section>
  );
};
