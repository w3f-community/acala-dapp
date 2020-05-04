import React, { FC, memo, useContext } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, TableItem, Table } from '@honzon-platform/ui-components';
import { useAccounts } from '@honzon-platform/react-hooks';
import { DexPoolSize, DexExchangeRate, DexReward, DexRewardRatio, DexUserShare } from '@honzon-platform/react-components';

import { DepositContext } from './Provider';
import { AccountDexTokens } from './AccountDexTokens';

export const PoolOverview: FC = memo(() => {
  const { enabledCurrencyIds, baseCurrencyId } = useContext(DepositContext);
  const { active } = useAccounts();
  const tableConfig: TableItem<CurrencyId>[] = [
    {
      title: 'Token Pair',
      align: 'left',
      width: 3,
      render: (token: CurrencyId) => (
        <AccountDexTokens
          account={active!.address}
          baseCurrencyId={baseCurrencyId}
          token={token}
        />
      )
    },
    {
      title: 'Exchange Rate',
      align: 'left',
      width: 3,
      render: (token: CurrencyId) => (
          <DexExchangeRate supply={token} />
        )
    },
    {
      title: 'Current Pool Size',
      align: 'left',
      width: 3,
      render: (token: CurrencyId) => (
        <DexPoolSize token={token} />
      )
    },
    {
      title: 'Pool Share',
      align: 'left',
      width: 1,
      render: (token: CurrencyId) => (
        <DexUserShare token={token} />
      )
    },
    {
      title: 'Reward Ratio',
      align: 'right',
      width: 1,
      render: (token: CurrencyId) => <DexRewardRatio token={token} />,
    },
    {
      title: 'Reward',
      align: 'right',
      width: 1,
      render: (token: CurrencyId) => <DexReward token={token} />,
    }
  ];
  return (
    <Card header='Deposit' gutter={false}>
      <Table
        config={tableConfig}
        data={enabledCurrencyIds}
        showHeader
      />
    </Card>
  );
});

PoolOverview.displayName = 'PoolOverview';
