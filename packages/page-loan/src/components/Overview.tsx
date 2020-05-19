import React, { FC, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, TableItem, Table, Button, Step } from '@acala-dapp/ui-components';
import { useAllLoans, useLoan, useConstants, filterEmptyLoan } from '@acala-dapp/react-hooks';
import { DerivedUserLoan } from '@acala-network/api-derive';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Token, LoanInterestRate, FormatBalance, LoanCollateralRate, formatCurrency } from '@acala-dapp/react-components';
import { ReactComponent as GuideBG } from '../assets/guide-bg.svg';
import { convertToFixed18 } from '@acala-network/app-util';

import { LoanContext } from './LoanProvider';
import classes from './Overview.module.scss';

export const Guide: FC = () => {
  const { setCurrentTab } = useContext(LoanContext);
  const stepConfig = [
    {
      index: 'select',
      text: 'Select Collateral'
    },
    {
      index: 'generate',
      text: 'Generate aUSD'
    },
    {
      index: 'confirm',
      text: 'Confirm'
    }
  ];

  const handleStart = (): void => {
    setCurrentTab('create');
  };

  return (
    <Card
      className={classes.guide}
      contentClassName={classes.content}
    >
      <Step
        className={classes.step}
        config={stepConfig}
        current={'select'}
      />
      <GuideBG className={classes.guideBg} />
      <Button
        color='primary'
        onClick={handleStart}
        size='small'
      >
        Get Started
      </Button>
    </Card>
  );
};

const DebitAmount: FC<{ token: CurrencyId | string }> = ({ token }) => {
  const { currentUserLoanHelper } = useLoan(token);

  return (
    <FormatBalance balance={currentUserLoanHelper?.debitAmount} />
  );
};

export const Overview: FC = () => {
  const [empty, setEmpty] = useState<boolean | null>(null);

  const { loans } = useAllLoans();
  const { setCurrentTab } = useContext(LoanContext);
  const { stableCurrency } = useConstants();

  const tableConfig: TableItem<DerivedUserLoan>[] = [
    {
      align: 'left',
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => (
        <Token token={token} />
      ),
      title: 'Token',
      width: 1
    },
    {
      align: 'right',
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <LoanInterestRate token={token} />,
      title: 'Rate',
      width: 1
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (data: DerivedUserLoan): ReactNode => (
        <FormatBalance
          balance={convertToFixed18(data.collaterals)}
          currency={data.token}
        />
      ),
      title: 'Deposit',
      width: 1
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (data: DerivedUserLoan): ReactNode => {
        return <DebitAmount token={data.token} />;
      },
      title: `Debit ${formatCurrency(stableCurrency)}`,
      width: 2
    },
    {
      align: 'right',
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => <LoanCollateralRate token={token} />,
      title: 'Current Ratio',
      width: 2
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (data: DerivedUserLoan): ReactNode => {
        const handleClick = (): void => {
          setCurrentTab(data.token);
        };

        return (
          <Button
            color='primary'
            onClick={handleClick}
            size='small'
          >
            Manage Loan
          </Button>
        );
      },
      title: '',
      width: 2
    }
  ];

  useEffect(() => {
    if (loans !== null) {
      setEmpty(!filterEmptyLoan(loans).length);
    }
  }, [loans]);

  // wait loading data
  if (empty === null) {
    return null;
  }

  if (empty) {
    return <Guide />;
  }

  return (
    <Card
      header='Overview'
      padding={false}
    >
      {
        loans && (
          <Table
            config={tableConfig}
            data={filterEmptyLoan(loans)}
            showHeader
          />
        )
      }
    </Card>
  );
};
