import React, { useContext, useState, useEffect, ReactNode, FC } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18, LoanHelper } from '@acala-network/app-util';

import { BalanceInput, UserBalance, Token, FormatFixed18, Price, LoanInterestRate, FormatBalance, formatCurrency } from '@acala-dapp/react-components';
import { useFormValidator, useConstants, useBalance } from '@acala-dapp/react-hooks';
import { Button, List, ListConfig } from '@acala-dapp/ui-components';

import { createProviderContext } from './CreateProvider';
import classes from './Generate.module.scss';
import { LoanContext } from './LoanProvider';

const Overview: FC<{ data: any }> = ({ data }) => {
  const listConfig: ListConfig[] = [
    {
      key: 'collateral',
      /* eslint-disable-next-line react/display-name */
      render: (value: CurrencyId): ReactNode => {
        return <Token token={value} />;
      },
      title: 'Collateralization'
    },
    {
      key: 'collateralRatio',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      },
      title: 'Collateralization Ratio'
    },
    {
      key: 'collateral',
      /* eslint-disable-next-line react/display-name */
      render: (data: CurrencyId): ReactNode => <Price token={data} />,
      title: `${formatCurrency(data.collateral)} Price`
    },
    {
      key: 'collateral',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyId): ReactNode => {
        return <LoanInterestRate token={token} />;
      },
      title: 'Interest Rate'
    },
    {
      key: 'liquidationRatio',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      },
      title: 'Liquidation Ratio'
    },
    {
      key: 'liquidationPenalty',
      /* eslint-disable-next-line react/display-name */
      render: (data: Fixed18): ReactNode => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      },
      title: 'Liquidation Penalty'
    }
  ];

  return (
    <div className={classes.overview}>
      <List
        config={listConfig}
        data={data}
        itemClassName={classes.item}
      />
    </div>
  );
};

export const Generate: FC = () => {
  const {
    currentLoanType,
    currentUserLoan,
    getUserLoanHelper,
    minmumDebitValue,
    selectedToken,
    setDeposit,
    setGenerate,
    setStep
  } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const { stableCurrency } = useConstants();
  const selectedCurrencyBalance = useBalance(selectedToken);
  const [maxGenerate, setMaxGenerate] = useState<Fixed18>(Fixed18.ZERO);
  const [collateral, setCollateral] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [userLoanHelper, setUserLoanHelper] = useState<LoanHelper | null>();

  const validator = useFormValidator({
    deposit: {
      currency: selectedToken,
      min: 0,
      type: 'balance'
    },
    generate: {
      max: maxGenerate.toNumber() || 0,
      min: minmumDebitValue.toNumber() || 0,
      type: 'number'
    }
  });

  const form = useFormik({
    initialValues: {
      deposit: (('' as any) as number),
      generate: (('' as any) as number)
    },
    onSubmit: noop,
    validate: validator
  });

  const overview = {
    collateral: selectedToken,
    collateralRatio: userLoanHelper?.collateralRatio,
    interestRate: userLoanHelper?.stableFeeAPR,
    liquidationPenalty: convertToFixed18(currentLoanType?.liquidationPenalty || 0),
    liquidationPrice: userLoanHelper?.liquidationPrice,
    liquidationRatio: userLoanHelper?.liquidationRatio
  };

  const handleNext = (): void => {
    setDeposit(form.values.deposit);
    setGenerate(form.values.generate);
    setStep('confirm');
  };

  const handlePrevious = (): void => {
    setStep('select');
  };

  const checkDisabled = (): boolean => {
    if (!form.values.deposit || !form.values.generate) {
      return true;
    }

    if (form.errors.deposit || form.errors.generate) {
      return true;
    }

    return false;
  };

  const handleDepositMax = (): void => {
    const data = convertToFixed18(selectedCurrencyBalance || 0).toNumber();

    setCollateral(data);
    form.setFieldValue('deposit', data);
  };

  useEffect(() => {
    const _result = getUserLoanHelper(currentUserLoan, currentLoanType, collateral, debit);

    setUserLoanHelper(_result);
  }, [collateral, debit, currentLoanType, currentUserLoan, getUserLoanHelper]);

  useEffect(() => {
    const data = Number(form.values.deposit) || 0;
    const helper = getUserLoanHelper(currentUserLoan, currentLoanType, data);

    setCollateral(data);

    if (helper) {
      setMaxGenerate(helper.canGenerate);
    }
  }, [currentLoanType, currentUserLoan, form.values.deposit, getUserLoanHelper]);

  useEffect(() => {
    setDebit(Number(form.values.generate) || 0);
  }, [form.values.generate]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.console}>
          <p className={classes.title}>
            How much {formatCurrency(selectedToken)} would you deposit as collateral?
          </p>
          <BalanceInput
            className={classes.input}
            error={!!form.errors.deposit}
            id='deposit'
            name='deposit'
            onChange={form.handleChange}
            onMax={handleDepositMax}
            showMaxBtn
            token={selectedToken}
            value={form.values.deposit}
          />
          <div className={classes.addon}>
            <span>Max to Lock</span>
            <UserBalance token={selectedToken} />
          </div>
          <p className={classes.title}>How much {stableCurrency.toString()} would you like to borrow?</p>
          <BalanceInput
            className={classes.input}
            error={!!form.errors.generate}
            id='generate'
            name='generate'
            onChange={form.handleChange}
            token={stableCurrency}
            value={form.values.generate}
          />
          <div className={classes.addon}>
            <span>Max to borrow</span>
            <FormatBalance
              balance={maxGenerate}
              currency={stableCurrency}
            />
          </div>
          <div className={classes.addon}>
            <span>Min to borrow</span>
            <FormatBalance
              balance={minmumDebitValue}
              currency={stableCurrency}
            />
          </div>
        </div>
        <Overview data={overview} />
      </div>
      <div className={classes.tips}>
        Note: collateralization ratio = total collateral in USD / amount borrowed must be above the required collateral ratio.
      </div>
      <div className={classes.action}>
        <Button
          onClick={cancelCurrentTab}
          size='small'
          type='ghost'
        >
          Cancel
        </Button>
        <Button
          onClick={handlePrevious}
          size='small'
          type='border'
        >
          Prev
        </Button>
        <Button
          color='primary'
          disabled={checkDisabled()}
          onClick={handleNext}
          size='small'
        >
          Next
        </Button>
      </div>
    </div>
  );
};
