import React, { FC, useRef } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash } from '@honzon-platform/react-components';
import { TableItem } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData, useConstants } from '@honzon-platform/react-hooks';
import { Fixed18 } from '@acala-network/app-util';

export const Transaction: FC = () => {
  const { dexBaseCurrency } = useConstants();

  const config = useRef<TableItem<ExtrinsicHistoryData>[]>([
    {
      align: 'left',
      dataIndex: 'hash',
      render: (value) => <FormatHash hash={value} />,
      title: 'Tx Hash'
    },
    {
      align: 'left',
      render: (data: ExtrinsicHistoryData) => {
        if (data.method === 'addLiquidity') {
          return (
            <FormatBalance 
              pair={[
                {
                  balance: Fixed18.fromParts(data.params[1]),
                  currency: data.params[0]
                },
                {
                  balance: Fixed18.fromParts(data.params[2]),
                  currency: dexBaseCurrency
                }
              ]}
              pairSymbol='+'
            />
          );
        }
        if (data.method === 'withdrawLiquidity') {
          return (
            <FormatBalance 
              pair={data.addon}
              pairSymbol='+'
            />
          );
        }
        if (data.method === 'withdrawIncentiveInterest') {
          return (
            <FormatBalance
              balance={data?.addon?.amount}
              currency={data?.addon?.currency}
            />
          );
        }
      },
      title: 'Token'
    },
    {
      align: 'left',
      dataIndex: 'method',
      render: (value: string) => {
        const paramsMap: Map<string, string> = new Map([
          ['addLiquidity', 'Deposit'],
          ['withdrawLiquidity', 'Withdraw'],
          ['withdrawIncentiveInterest', 'Withdraw System Reward']
        ]);
        return paramsMap.get(value);
      },
      title: 'Deposit/Withdraw'
    },
    {
      align: 'right',
      dataIndex: 'time',
      render: (value) => (
        <FormatTime time={value} />
      ),
      title: 'When'
    }
  ]);

  return (
    <BaseTxHistory
      config={config.current}
      method={['addLiquidity', 'withdrawLiquidity', 'withdrawIncentiveInterest']}
      section='dex'
    />
  );
};
