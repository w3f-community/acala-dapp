import React, { useContext, ChangeEvent, useState } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18, calcCanGenerate, collateralToUSD } from '@acala-network/app-util';

import { BalanceInput, UserBalance, Token, FormatFixed18, Price, LoanInterestRate, FormatBalance, formatCurrency } from '@honzon-platform/react-components';
import { useApi, useLoan, useFormValidator,  useAccounts, useConstants } from '@honzon-platform/react-hooks';
import { Button, List, ListConfig } from '@honzon-platform/ui-components';

import { createProviderContext } from './CreateProvider';
import classes from './Generate.module.scss';
import { LoanContext } from './LoanProvider';

const Overview = ({ data }: any) => {
  const listConfig: ListConfig[] = [
    {
      key: 'collateral',
      title: 'Collateralization',
      render: (value: CurrencyId) => {
        return <Token token={value} />
      }
    },
    {
      key: 'collateralRatio',
      title: 'Collateralization Ratio',
      render: (data: Fixed18) => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        )
      }
    },
    {
      key: 'collateral',
      title: `${formatCurrency(data.collateral)} Price`,
      render: (data: CurrencyId) => <Price token={data} />
    },
    {
      key: 'collateral',
      title: 'Interest Rate',
      render: (token: CurrencyId) => {
        return <LoanInterestRate token={token} />
      }
    },
    {
      key: 'liquidationRatio',
      title: 'Liquidation Ratio',
      render: (data: Fixed18) => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      }
    },
    {
      key: 'liquidationPenalty',
      title: 'Liquidation Penalty',
      render: (data: Fixed18) => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      }
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

export const Generate = () => {
  const { api } = useApi();
  const { selectedToken, setDeposit, setGenerate, setStep } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const { stableCurrency } = useConstants();
  const [canGenerate, setCanGenerate] = useState<number>(0);
  const { currentLoanType, getCurrentUserLoanHelper, setCollateral, setDebitStableCoin } = useLoan(selectedToken);
  const currentUserLoanHelper = getCurrentUserLoanHelper();

  const validator = useFormValidator({
    deposit: { type: 'balance', currency: selectedToken, min: 0 },
    generate: { type: 'number', max: canGenerate, min: 0 }
  });

  const form = useFormik({
    initialValues: {
      deposit: '' as any as number,
      generate: '' as any as number
    },
    validate: validator,
    onSubmit: noop
  });

  const handleDepositChange = (event: ChangeEvent<any>) => {
    const data = Number(event.target.value) || 0;
    setCollateral(data);
    setCanGenerate(
      calcCanGenerate(
        collateralToUSD(
          Fixed18.fromNatural(data),
          currentUserLoanHelper.collateralPrice
        ),
        Fixed18.ZERO,
        currentUserLoanHelper.requiredCollateralRatio,
        currentUserLoanHelper.stableCoinPrice
      ).toNumber()
    );
    form.handleChange(event);
  };

  const handleGenerageChange = (event: ChangeEvent<any>) => {
    const data = Number(event.target.value) || 0;
    setDebitStableCoin(data);
    form.handleChange(event);
  };

  const overview = {
    collateral: selectedToken,
    collateralRatio: currentUserLoanHelper.collateralRatio,
    interestRate: currentUserLoanHelper.stableFeeAPR,
    liquidationPrice: currentUserLoanHelper.liquidationPrice,
    liquidationRatio: currentUserLoanHelper.liquidationRatio,
    liquidationPenalty: convertToFixed18(currentLoanType ? currentLoanType.liquidationPenalty : 0)
  };

  const handleNext = (): void => {
    setDeposit(form.values.deposit);
    setGenerate(form.values.generate);
    setStep('confirm');
  };

  const handlePrevious = (): void => {
    setStep('select');
  };

  const checkDisabled = () => {
    if (!form.values.deposit || !form.values.generate) {
      return true;
    }
    if (form.errors.deposit || form.errors.generate) {
      return true;
    }
    return false;
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.console}>
          <p className={classes.title}>
            How much DOT would you deposit as collateral?
          </p>
          <BalanceInput
            className={classes.input}
            error={!!form.errors.deposit}
            id='deposit'
            name='deposit'
            token={selectedToken}
            value={form.values.deposit}
            onChange={handleDepositChange}
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
            token={stableCurrency}
            value={form.values.generate}
            onChange={handleGenerageChange}
          />
          <div className={classes.addon}>
            <span>Max to borrow</span>
            <FormatBalance
              balance={canGenerate}
              currency={stableCurrency}
            />
          </div>
        </div>
        <Overview data={overview} />
      </div>
      <div className={classes.tips}>
        Note: collateralization ratio = amount borrowed / total collateral in USD must be above the required collateral ratio.
      </div>
      <div className={classes.action}>
        <Button
          type='ghost'
          size='small'
          onClick={cancelCurrentTab}
        >
          Cancel
        </Button>
        <Button
          type='border'
          size='small'
          onClick={handlePrevious}
        >
          Prev
        </Button>
        <Button
          color='primary'
          size='small'
          disabled={checkDisabled()}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
