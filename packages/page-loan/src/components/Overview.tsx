import React, { FC, useContext, useState, useEffect } from 'react';
import { Card, TableItem, Table, Button, Step } from '@honzon-platform/ui-components';
import { useAllLoans, useLoan, useConstants, filterEmptyLoan } from '@honzon-platform/react-hooks';
import { DerivedUserLoan } from '@acala-network/api-derive';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Token, LoanInterestRate, FormatBalance, LoanCollateralRate, formatCurrency } from '@honzon-platform/react-components';
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

export const Overview: FC = () => {
  const [empty, setEmpty] = useState<boolean | null>(null);

  const { loans } = useAllLoans();
  const { setCurrentTab } = useContext(LoanContext);
  const { stableCurrency } = useConstants();

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
      align: 'right',
      dataIndex: 'token',
      render: (token: CurrencyId) => <LoanInterestRate token={token} />,
      title: 'Rate',
      width: 1
    },
    {
      align: 'right',
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
      align: 'right',
      title: `Debit ${formatCurrency(stableCurrency)}`,
      width: 2,
      render: (data: DerivedUserLoan) => {
        const { getCurrentUserLoanHelper } = useLoan(data.token);

        return (
          <FormatBalance balance={getCurrentUserLoanHelper().debitAmount} />
        );
      }
    },
    {
      align: 'right',
      title: 'Current Ratio',
      width: 2,
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
            color='primary'
            onClick={handleClick}
            size='small'
          >
            Manage Loan
          </Button>
        );
      }
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
      padding={false}
      header='Overview'
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
