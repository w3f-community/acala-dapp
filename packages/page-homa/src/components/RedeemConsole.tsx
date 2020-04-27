import React, { FC, useContext, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';
import { Fixed18 } from '@acala-network/app-util';

import { Grid, List, Radio, Input } from '@honzon-platform/ui-components';
import { StakingPoolContext, TxButton, BalanceInput, formatCurrency, numToFixed18Inner } from "@honzon-platform/react-components";
import { useFormValidator } from '@honzon-platform/react-hooks';

import classes from './RedeemConsole.module.scss';

export const RedeemConsole: FC = () => {
  const { stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);
  const validator = useFormValidator({
    stakingBalance: {
      type: 'balance',
      currency: stakingPool.stakingCurrency
    }
  });
  const form = useFormik({
    initialValues: {
      amount: '' as any as number,
      target: '' as any as number,
    },
    validate: validator,
    onSubmit: noop
  });
  const resetForm = useCallback(() => {
    form.resetForm();
  }, []);

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

  const estimated = {
    receivedLiquidToken: Fixed18.fromNatural(form.values.amount),
    climeFee: stakingPoolHelper.claimFee(
      Fixed18.fromNatural(form.values.amount), form.values.target
    ),
  };

  const listConfig = [
    {
      key: 'Redeemed',
      title: 'Mint',
      render: (value: any) => `${value.toNumber()} ${formatCurrency(stakingPool.liquidCurrency)}`
    },
    {
      key: 'depositStakingToken',
      title: 'Claim Fee',
      render: (value: any) => `${value} ${formatCurrency(stakingPool.stakingCurrency)}`
    }
  ];
  const checkDisabled = () => {
    if (!form.values.amount) {
      return true;
    }
    if (form.errors.amount) {
      return true;
    }
    return false;
  };

  return (
    <Grid
      direction='column'
      className={classes.root}
    >
      <Grid item>
        <p>Withdraw deposit and interest</p>
      </Grid>
      <Grid item>
          <BalanceInput
            id='amount'
            name='amount'
            value={form.values.amount}
            onChange={form.handleChange}
            token={stakingPool.liquidCurrency}
          />
      </Grid>
      <div className={classes.select}>
        <Radio
          className={classes.item}
          label='Redeem Now'
        />
        <Radio
          className={classes.item}
          label={(
            <div className={classes.targetInput}>
              <span>Redeem in</span>
              <Input
                className={classes.input}
                id='target'
                name='target'
                value={form.values.target}
                onChange={form.handleChange}
              />
              ERA
            </div>
          )}
        />
        <Radio
          className={classes.item}
          label='Redeem & Wait for Unbounding Period'
        />
      </div>
      <Grid container item justifyContent='center'>
        <TxButton
          className={classes.txBtn}
          disabled={checkDisabled()}
          section='homa'
          method='mint'
          params={[numToFixed18Inner(form.values.stakingBalance)]}
          onFinally={resetForm}
        >
          Redeem
        </TxButton>
      </Grid>
      <Grid item>
        <List data={estimated} config={listConfig} />
      </Grid>
    </Grid>
  );
};

