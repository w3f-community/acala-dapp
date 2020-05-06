import React, { FC, useContext, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Fixed18, convertToFixed18 } from '@acala-network/app-util';
import { Grid, List } from '@honzon-platform/ui-components';
import { StakingPoolContext, TxButton, BalanceInput, numToFixed18Inner, FormatBalance } from '@honzon-platform/react-components';
import { useFormValidator } from '@honzon-platform/react-hooks';

import classes from './StakingConsole.module.scss';

export const StakingConsole: FC = () => {
  const { rewardRate, stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);

  const validator = useFormValidator({
    stakingBalance: {
      type: 'balance',
      currency: stakingPool && stakingPool.stakingCurrency
    }
  });
  const form = useFormik({
    initialValues: {
      stakingBalance: '' as any as number
    },
    validate: validator,
    onSubmit: noop
  });
  const resetForm = useCallback(() => {
    form.resetForm();
  }, [form]);

  if (!stakingPoolHelper || !stakingPool) {
    return null;
  }

  const estimated = {
    receivedLiquidToken: stakingPoolHelper.convertToLiquid(Fixed18.fromNatural(form.values.stakingBalance)),
    depositStakingToken: Fixed18.fromNatural(form.values.stakingBalance).mul(convertToFixed18(rewardRate || 0))
  };

  const listConfig = [
    {
      key: 'receivedLiquidToken',
      title: 'Mint',
      render: (value: Fixed18) => (
        value.isFinity() ? (<FormatBalance
          balance={value}
          currency={stakingPool.liquidCurrency}
        />): '~'
      )
    },
    {
      key: 'depositStakingToken',
      title: 'Estimated Profit / Era',
      render: (value: Fixed18) => (
        value.isFinity() ? (<FormatBalance
          balance={value}
          currency={stakingPool.liquidCurrency}
        />): '~'
      )
    }
  ];

  const checkDisabled = () => {
    if (!form.values.stakingBalance) {
      return true;
    }

    if (form.errors.stakingBalance) {
      return true;
    }

    return false;
  };

  return (
    <Grid
      className={classes.root}
      direction='column'
    >
      <Grid item>
        <p>Deposit DOT & Mint Liquid DOT (L-DOT). Your DOTs will be staked to earn returns, meanwhile you can use, trade and invest L-DOT balance in your wallet.</p>
      </Grid>
      <Grid item>
        <BalanceInput
          error={!!form.errors.stakingBalance}
          id='stakingBalance'
          name='stakingBalance'
          onChange={form.handleChange}
          token={stakingPool.stakingCurrency}
          value={form.values.stakingBalance}
        />
      </Grid>
      <Grid container
        item
        justifyContent='center'>
        <TxButton
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='mint'
          onSuccess={resetForm}
          params={[numToFixed18Inner(form.values.stakingBalance)]}
          section='homa'
          size='middle'
        >
          Deposit
        </TxButton>
      </Grid>
        <List
          config={listConfig}
          data={estimated}
        />
    </Grid>
  );
};
