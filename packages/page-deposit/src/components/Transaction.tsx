import React, { FC, useRef, useContext } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash } from '@honzon-platform/react-components';
import { TableItem, Status } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData, useConstants } from '@honzon-platform/react-hooks';
import { Fixed18 } from '@acala-network/app-util';
import { DepositContext } from './Provider';

const actionMap: { [key: string]: string } = {
  'deposit': 'add_liquidity',
  'withdraw': 'withdraw_liquidity',
  'reward': 'withdraw_incentive_interest'
};

export const Transaction: FC = () => {
  const { dexBaseCurrency } = useConstants();
  const { action } = useContext(DepositContext);

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
        if (data.method === 'add_liquidity') {
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
        if (data.method === 'withdraw_incentive_interest') {
          return '/';
        }
        if (data.method === 'withdrawIncentiveInterest') {
          return '/';
        }
      },
      title: 'Token'
    },
    {
      align: 'left',
      dataIndex: 'method',
      render: (value: string) => {
        const paramsMap: Map<string, string> = new Map([
          ['add_liquidity', 'Deposit'],
          ['withdraw_liquidity', 'Withdraw'],
          ['withdraw_incentive_interest', 'Withdraw System Reward']
        ]);
        return paramsMap.get(value) || value;
      },
      title: 'Deposit/Withdraw'
    },
    {
      align: 'left',
      dataIndex: 'time',
      render: (value) => (
        <FormatTime time={value} />
      ),
      title: 'When'
    },
    {
      align: 'right',
      dataIndex: 'success',
      render: (value) => (
        <Status success={value} />
      ),
      title: 'Result'
    }
  ]);

      // method={['addLiquidity', 'withdrawLiquidity', 'withdrawIncentiveInterest']}
  return (
    <BaseTxHistory
      config={config.current}
      method={actionMap[action]}
      section='dex'
    />
  );
};
