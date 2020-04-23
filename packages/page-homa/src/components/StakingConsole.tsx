import React, { FC, useContext, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';
import { Fixed18, StakingPoolHelper } from '@acala-network/app-util';

import { Grid, List } from '@honzon-platform/ui-components';
import { StakingPoolContext, TxButton, BalanceInput, formatCurrency, numToFixed18Inner } from "@honzon-platform/react-components";

export const StakingConsolee: FC = () => {
  const { stakingPool, stakingPoolHelper } = useContext(StakingPoolContext);
  const form = useFormik({
    initialValues: {
      stakingBalance: '',
    },
    onSubmit: noop // no need submit
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
      render: (value: any) => `${value.toNumber()} ${formatCurrency(stakingPool.liquidCurrency)}`
    },
    {
      key: 'depositStakingToken',
      title: 'Estimated Profit / Era',
      render: (value: any) => `${value} ${formatCurrency(stakingPool.stakingCurrency)}`
    }
  ]

  return (
    <Grid direction='column'>
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
          />
      </Grid>
      <Grid item>
        <TxButton
          section='homa'
          method='mint'
          params={[numToFixed18Inner(form.values.stakingBalance)]}
          onFinally={resetForm}
        >
          Deposit
        </TxButton>
      </Grid>
      <Grid item>
        <List data={estimated} config={listConfig} />
      </Grid>
    </Grid>
  );
};

