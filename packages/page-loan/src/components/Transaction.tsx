import React, { FC, useState, useEffect } from 'react';

import { BaseTxHistory, FormatTime, FormatHash, Token, formatBalance, formatCurrency } from '@honzon-platform/react-components';
import { TableItem, Status } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData, useConstants, useApi } from '@honzon-platform/react-hooks';
import { Fixed18, debitToStableCoin, convertToFixed18 } from '@acala-network/app-util';
import { Codec } from '@polkadot/types/types';

const ZERO = Fixed18.ZERO;

interface ActionProps {
  collatera: string;
  debit: string;
  token: string;
  block: number;
}

const Action: FC<ActionProps> = ({
  collatera,
  debit,
  token,
  block
}) => {
  const { api } = useApi();
  const { stableCurrency } = useConstants();
  const _collateral = Fixed18.fromParts(collatera);
  const _debit = Fixed18.fromParts(debit);
  const [debitExchangeRate, setDebitExchangeRate] = useState<Codec>();

  useEffect(() => {
    if (api && block) {
      (async () => {
        const hash = await api.query.system.blockHash(block);
        const result = await api.query.cdpEngine.debitExchangeRate.at(hash, token);
        setDebitExchangeRate(result);
      })();
    }
  }, [api, block]);

  const message: Array<string> = [];

  if (debitExchangeRate && debitExchangeRate.isEmpty) {
    return <span>DebitExchangeRate Failed</span>
  }

  if (_collateral.isGreaterThan(ZERO)) {
    message.push(`Deposit ${formatBalance(_collateral)} ${formatCurrency(token)}`);
  }

  if (_collateral.isLessThan(ZERO)) {
    message.push(`Withdraw ${formatBalance(_collateral.negated())} ${formatCurrency(token)}`);
  }

  if (_debit.isGreaterThan(ZERO)) {
    message.push(
      `Generate ${formatBalance(
        debitToStableCoin(_debit, convertToFixed18(debitExchangeRate || 0))
      )} ${formatCurrency(stableCurrency)}`
    );
  }

  if (_debit.isLessThan(ZERO)) {
    message.push(
      `Pay Back ${formatBalance(
        debitToStableCoin(_debit.negated(), convertToFixed18(debitExchangeRate || 0))
      )} ${formatCurrency(stableCurrency)}`
    );
  }

  return <span>{message.join(', ')}</span>;
};

export const Transaction: FC = () => {
  const config: TableItem<ExtrinsicHistoryData>[] = [
    {
      align: 'left',
      dataIndex: 'hash',
      width: 2,
      render: (value) => <FormatHash hash={value} />,
      title: 'Tx Hash'
    },
    {
      align: 'left',
      width: 1,
      dataIndex: 'params',
      render: (value) => <Token token={value[0]} />,
      title: 'Token'
    },
    {
      align: 'left',
      width: 2,
      render: (data) => (
        <Action
          collatera={data?.params[1]}
          debit={data?.params[2]}
          token={data?.params[0]}
          block={data?.blockNum}
        />
      ),
      title: 'Action'
    },
    {
      align: 'left',
      dataIndex: 'time',
      width: 1,
      render: (value) => (
        <FormatTime time={value} />
      ),
      title: 'When'
    },
    {
      align: 'right',
      width: 1,
      dataIndex: 'success',
      render: (value) => (
        <Status success={value} />
      ),
      title: 'Result'
    }
  ];

  return (
    <BaseTxHistory
      config={config}
      method='adjust_loan'
      section='honzon'
    />
  );
};
