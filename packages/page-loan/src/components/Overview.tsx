import React, { FC, useContext, useState, useEffect } from 'react';
import { Card, TableItem, Table, Button, Step } from '@honzon-platform/ui-components';
import { useAllLoans, useLoan } from '@honzon-platform/react-hooks';
import { DerivedUserLoan } from '@acala-network/api-derive';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Token, LoanInterestRate, FormatBalance, LoanCollateralRate } from '@honzon-platform/react-components';
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
        onClick={handleStart}
        size='small'
        color='primary'
      >
        Get Started
      </Button>
    </Card>
  );
};

export const Overview: FC = () => {
  const [empty, setEmpty] = useState<boolean | null>(null);

  const { loans } = useAllLoans({ filterEmpty: true });
  const { setCurrentTab } = useContext(LoanContext);

  const tableConfig: TableItem<DerivedUserLoan>[] = [
    {
      align: 'left',
      dataIndex: 'token',
      render: (token: CurrencyId) => (
        <Token token={token} />
      ),
      title: 'Token',
      width: 1
    },
    {
      align: 'left',
      dataIndex: 'token',
      render: (token: CurrencyId) => <LoanInterestRate token={token} />,
      title: 'Interest Rate',
      width: 2
    },
    {
      align: 'left',
      title: 'Deposit',
      width: 1,
      render: (data: DerivedUserLoan) => (
        <FormatBalance
          balance={convertToFixed18(data.collaterals)}
          currency={data.token}
        />
      )
    },
    {
      align: 'left',
      title: 'Debit',
      width: 1,
      render: (data: DerivedUserLoan) => {
        const { currentUserLoanHelper } = useLoan(data.token);
        return (
          <FormatBalance
            balance={currentUserLoanHelper.debitAmount}
            currency={'AUSD'}
          />
        );
      }
    },
    {
      align: 'left',
      title: 'Current Ratio',
      width: 1,
      dataIndex: 'token',
      render: (token: CurrencyId) => <LoanCollateralRate token={token} />
    },
    {
      align: 'right',
      title: '',
      width: 2,
      render: (data: DerivedUserLoan) => {
        const handleClick = () => {
          setCurrentTab(data.token);
        };

        return (
          <Button
            size='small'
            color='primary'
            onClick={handleClick}
          >
            Manage Loan
          </Button>
        );
      }
    },
  ];

  useEffect(() => {
    if (loans !== null) {
      setEmpty(!loans.length);
    }
  }, [loans])

  console.log(loans);

  // wait loading data
  if (empty === null) {
    return null;
  }

  if (empty) {
    return <Guide />
  }

  return (
    <Card
      header='Overview'
      gutter={false}
    >
      <Table
        showHeader
        config={tableConfig}
        data={loans}
      />
    </Card>
  );
}