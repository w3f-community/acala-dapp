import React, { FC, useContext, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';
import clsx from 'clsx';

import { Fixed18 } from '@acala-network/app-util';
import { Grid, List } from '@honzon-platform/ui-components';
import { StakingPoolContext, TxButton, BalanceInput, formatCurrency, numToFixed18Inner, FormatBalance } from "@honzon-platform/react-components";
import { useFormValidator } from '@honzon-platform/react-hooks';

import classes from './StakingConsole.module.scss';

export const StakingConsolee: FC = () => {
  const { stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);
  const validator = useFormValidator({
    stakingBalance: {
      type: 'balance',
      currency: stakingPool.stakingCurrency
    }
  });
  const form = useFormik({
    initialValues: {
      stakingBalance: '' as any as number,
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
    receivedLiquidToken: stakingPoolHelper.convertToLiquid(Fixed18.fromNatural(form.values.stakingBalance)),
    depositStakingToken: form.values.stakingBalance
  };

  const listConfig = [
    {
      key: 'receivedLiquidToken',
      title: 'Mint',
      render: (value: any) => (
        <FormatBalance
          balance={value}
          currency={stakingPool.liquidCurrency}
        />
      )
    },
    {
      key: 'depositStakingToken',
      title: 'Estimated Profit / Era',
      render: (value: any) => (
        <FormatBalance
          balance={value}
          currency={stakingPool.stakingCurrency}
        />
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
      direction='column'
      className={classes.root}
    >
      <Grid item>
        <p>Deposit DOT & Mint Liquidt DOT (L-DOT). Your DOTs will be staked to earn returns, meanwhile you can use, trade and invest L-DOT balance in your wallet.</p>
      </Grid>
      <Grid item>
          <BalanceInput
            id='stakingBalance'
            name='stakingBalance'
            value={form.values.stakingBalance}
            onChange={form.handleChange}
            token={stakingPool.stakingCurrency}
            error={!!form.errors.stakingBalance}
          />
      </Grid>
      <Grid container item justifyContent='center'>
        <TxButton
          size='middle'
          className={classes.txBtn}
          disabled={checkDisabled()}
          section='homa'
          method='mint'
          params={[numToFixed18Inner(form.values.stakingBalance)]}
          onSuccess={resetForm}
        >
          Deposit
        </TxButton>
      </Grid>
      <Grid
        item
        className={
          clsx(classes.estimated, {
            [classes.show]: !!form.values.stakingBalance
          })
        }
      >
        <List
          data={estimated}
          config={listConfig}
        />
      </Grid>
    </Grid>
  );
};

