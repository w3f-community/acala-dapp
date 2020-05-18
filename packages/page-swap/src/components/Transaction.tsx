import React, { FC, useRef } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash, Token, formatBalance, formatCurrency } from '@honzon-platform/react-components';
import { TableItem, Status } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData, useConstants, useLoan } from '@honzon-platform/react-hooks';
import { Fixed18, debitToStableCoin, convertToFixed18 } from '@acala-network/app-util';

const ZERO = Fixed18.ZERO;

interface ActionProps {
  supply: string;
  supplyCurrency: string;
  target: string;
  targetCurrency: string;
}

const Action: FC<ActionProps> = ({
  supply,
  supplyCurrency,
  target,
  targetCurrency
}) => {
  return (
    <FormatBalance
      pair={[
        {
          currency: supplyCurrency,
          balance: Fixed18.fromParts(supply)
        },
        {
          currency: targetCurrency,
          balance: Fixed18.fromParts(target)
        }
      ]}
      pairSymbol='->'
    />
  );
};

export const Transaction: FC = () => {
  const config = useRef<TableItem<ExtrinsicHistoryData>[]>([
    {
      align: 'left',
      dataIndex: 'hash',
      render: (value) => <FormatHash hash={value} />,
      title: 'Tx Hash'
    },
    {
      align: 'left',
      dataIndex: 'params',
      render: (value) => (
        <Action
          supply={value[1]}
          supplyCurrency={value[0]}
          target={value[3]}
          targetCurrency={value[2]}
        />
      ),
      title: 'Action'
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

  return (
    <BaseTxHistory
      config={config.current}
      method='swap_currency'
      section='dex'
    />
  );
};
