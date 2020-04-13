import React, { ChangeEventHandler, FC, useContext, useState, useEffect, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';
import { Fixed18, StakingPoolHelper } from '@acala-network/app-util';

import { Card } from "@honzon-platform/ui-components";
import { StakingPoolContext, TxButton, BalanceInput, formatCurrency, numToFixed18Inner } from "@honzon-platform/react-components";

export const StakingManipulate: FC = () => {
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

  const receivedLiquidToken = stakingPoolHelper.convertToLiquid(Fixed18.fromNatural(form.values.stakingBalance));

  return (
    <Card size="large" elevation={1}>
      <p>
        {`How much ${formatCurrency(stakingPool.stakingCurrency)} you want to stake?`}
      </p>
          <BalanceInput
            id='stakingBalance'
            name='stakingBalance'
            value={form.values.stakingBalance}
            onChange={form.handleChange}
            token={stakingPool.stakingCurrency}
          />
          <TxButton
            section='homa'
            method='mint'
            params={[numToFixed18Inner(form.values.stakingBalance)]}
            onFinally={resetForm}
          >
            Staking
          </TxButton>
      {
        form.values.stakingBalance ? (
          <p>
            {`You will receive ${receivedLiquidToken.toNumber()} ${formatCurrency(stakingPool.liquidCurrency)}`}
          </p>
        ) : null
      }
    </Card>
  );
};

