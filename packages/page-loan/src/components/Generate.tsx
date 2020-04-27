import React, { useContext, ChangeEvent } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId, Rate } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18, calcCanGenerate } from '@acala-network/app-util';

import { BalanceInput, UserBalance, getStableCurrencyId, Token, FormatFixed18, Price, LoanInterestRate, getValueFromTimestampValue } from '@honzon-platform/react-components';
import { useApi, useLoan, useFormValidator } from '@honzon-platform/react-hooks';
import { Button, List, ListConfig } from '@honzon-platform/ui-components';

import { createProviderContext } from './CreateProvider';
import classes from './Generate.module.scss';

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
      title: 'DOT Price',
      render: (token: CurrencyId) => {
        return <Price token={token} />;
      }
    },
    {
      key: 'x',
      title: 'Interest Rate',
      render: (token: CurrencyId) => {
        return <LoanInterestRate token={token} />
      }
    },
    {
      key: 'liquidationPrice',
      title: 'Liquidation Price',
      render: (data: Fixed18) => {
        return <FormatFixed18 data={data} />;
      },
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
  const stableCurrencyId = getStableCurrencyId(api);
  const { currentLoanType, currentUserLoanHelper, collateralPrice } = useLoan(selectedToken);
  const validator = useFormValidator({
    deposit: {
      type: 'balance',
      currency: selectedToken,
      min: 0
    },
    generate: {
      type: 'number',
      max: currentUserLoanHelper.canGenerate ? currentUserLoanHelper.canGenerate.toNumber() : 0
    }
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
    const data = Number(event.target.value);
    currentUserLoanHelper.collaterals = currentUserLoanHelper.collaterals.add(
      Fixed18.fromNatural(data || 0)
    );
    form.handleChange(event);
  };

  const overview = {
    collateral: selectedToken,
    collateralRatio: currentUserLoanHelper.collateralRatio,
    collateralPrice: convertToFixed18(
      collateralPrice
      ? getValueFromTimestampValue(collateralPrice.price)
      : 0
    ),
    interestRate: currentUserLoanHelper.stableFeeAPR,
    liquidationPrice: currentUserLoanHelper.liquidationPrice,
    liquidationRatio: convertToFixed18(currentLoanType ? currentLoanType.liquidationRatio : 0),
    liquidationPenalty: convertToFixed18(currentLoanType? currentLoanType.liquidationPenalty : 0)
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

  console.log(form.errors);

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
          <p className={classes.title}>How much {stableCurrencyId.toString()} would you like to borrow?</p>
          <BalanceInput
            className={classes.input}
            id='generate'
            name='generate'
            token={stableCurrencyId}
            value={form.values.generate}
            onChange={form.handleChange}
          />
          <div className={classes.addon}>
            <span>Max to borrow</span>
            <UserBalance token={stableCurrencyId} />
          </div>
        </div>
        <Overview data={overview} />
      </div>
      <div className={classes.tips}>
        Note: collateralization ratio = amount borrowed / total collateral in USD must be above the required collateral ratio.
      </div>
      <div className={classes.action}>
        <Button
          size='small'
          onClick={handlePrevious}
          normal
        >
          Previous
        </Button>
        <Button
          size='small'
          normal
        >
          Cancel
        </Button>
        <Button
          size='small'
          disabled={checkDisabled()}
          onClick={handleNext}
          primary
        >
          Next
        </Button>
      </div>
    </div>
  );
};
