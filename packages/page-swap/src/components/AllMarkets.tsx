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
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: string | CurrencyId): ReactNode => (
        <Token
          icon
          token={token}
        />
      ),
      title: 'Token Pair',
      width: 1
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: string | CurrencyId): ReactNode => <DexExchangeRate supply={token} />,
      title: 'Market Price',
      width: 3
    },
    {
      align: 'left',
      /* eslint-disable-next-line react/display-name */
      render: (token: string | CurrencyId): ReactNode => <DexPoolSize token={token} />,
      title: 'Pool Size',
      width: 3
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
