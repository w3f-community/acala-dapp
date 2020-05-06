import React, { FC } from 'react';

import { BaseTxHistory, FormatBalance, FormatTime, FormatHash, Token, formatBalance, formatCurrency } from '@honzon-platform/react-components';
import { TableItem } from '@honzon-platform/ui-components';
import { ExtrinsicHistoryData, useConstants, useLoan } from '@honzon-platform/react-hooks';
import { Fixed18, debitToStableCoin, convertToFixed18 } from '@acala-network/app-util';

const ZERO = Fixed18.ZERO;

interface ActionProps {
  collatera: string;
  debit: string;
  token: string;
}

const Action: FC<ActionProps> = ({
  collatera,
  debit,
  token
}) => {
  const { stableCurrency } = useConstants();
  const { currentLoanType } = useLoan(token);
  const _collateral = Fixed18.fromParts(collatera);
  const _debit = Fixed18.fromParts(debit);

  const message: Array<string> = [];

  if (_collateral.isGreaterThan(ZERO)) {
    message.push(`Deposit ${formatBalance(_collateral)} ${formatCurrency(token)}`);
  }

  if (_collateral.isLessThan(ZERO)) {
    message.push(`'Withdraw ${formatBalance(_collateral.negated())} ${formatCurrency(token)}`);
  }

  if (_debit.isGreaterThan(ZERO)) {
    message.push(
      `Generate ${formatBalance(
        debitToStableCoin(_debit, convertToFixed18(currentLoanType?.debitExchangeRate || 0))
      )} ${formatCurrency(stableCurrency)}`
    );
  }

  if (_debit.isLessThan(ZERO)) {
    message.push(
      `Pay Back ${formatBalance(
        debitToStableCoin(_debit.negated(), convertToFixed18(currentLoanType?.debitExchangeRate || 0))
      )} ${formatCurrency(stableCurrency)}`
    );
  }

  return <span>{message.join(', ')}</span>;
};

export const Transaction: FC = () => {
  const config: TableItem<ExtrinsicHistoryData>[] = [
    {
      align: 'left',
      dataIndex: 'params',
      render: (value) => <Token token={value[0]} />,
      title: 'Token'
    },
    {
      align: 'left',
      dataIndex: 'params',
      render: (value) => (
        <Action
          collatera={value[1]}
          debit={value[2]}
          token={value[0]}
        />
      ),
      title: 'Action'
    },
    {
      align: 'left',
      dataIndex: 'hash',
      render: (value) => <FormatHash hash={value} />,
      title: 'Tx Hash'
    },
    {
      align: 'right',
      dataIndex: 'time',
      render: (value) => (
        <FormatTime time={value} />
      ),
      title: 'When'
    }
  ];

  return (
    <BaseTxHistory
      config={config}
      method='adjustLoan'
      section='honzon'
    />
  );
};
