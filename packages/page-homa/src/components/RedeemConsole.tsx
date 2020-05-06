import React, { FC, useContext, useCallback, useState } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';
import clsx from 'clsx';

import { Fixed18 } from '@acala-network/app-util';
import { Grid, List, Radio, Input } from '@honzon-platform/ui-components';
import { StakingPoolContext, TxButton, BalanceInput, numToFixed18Inner, formtDuration, FormatBalance } from '@honzon-platform/react-components';
import { useFormValidator } from '@honzon-platform/react-hooks';

import classes from './RedeemConsole.module.scss';
import { TargetRedeemList } from './TargetRedeemList';

type RedeemType = 'Immediately' | 'Target' | 'WaitForUnbonding';

export const RedeemConsole: FC = () => {
  const { stakingPool, stakingPoolHelper, unbondingDuration } = useContext(StakingPoolContext);
  const validator = useFormValidator({
    amount: {
      type: 'balance',
      currency: stakingPool.liquidCurrency
    },
    target: {
      type: 'number',
      min: stakingPoolHelper.currentEra
    }
  });
  const [redeemType, setRedeemType] = useState<RedeemType>('Immediately');
  const [era, setEra] = useState<number>(0);
  const form = useFormik({
    initialValues: {
      amount: '' as any as number,
      target: '' as any as number
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

  const getTargetEra = () => {
    if (redeemType === 'Immediately') {
      return stakingPoolHelper.currentEra;
    }

    if (redeemType === 'Target') {
      return form.values.target;
    }

    if (redeemType === 'WaitForUnbonding') {
      return stakingPool.currentEra.toNumber() + stakingPool.bondingDuration.toNumber();
    }

    return stakingPoolHelper.currentEra;
  };

  const info = {
    redeemed: Fixed18.fromNatural(form.values.amount),
    climeFee: stakingPoolHelper.claimFee(
      Fixed18.fromNatural(form.values.amount), getTargetEra()
    )
  };

  const listConfig = [
    {
      key: 'redeemed',
      title: 'Redeemed',
      render: (value: any) => (
        <FormatBalance
          balance={value}
          currency={stakingPool.liquidCurrency}
        />
      )
    },
    {
      key: 'climeFee',
      title: 'Claim Fee',
      render: (value: Fixed18) => (
        <FormatBalance
          balance={value}
          currency={stakingPool.liquidCurrency}
        />
      )
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

  const getParams = () => {
    const _params = [
      numToFixed18Inner(form.values.amount),
      redeemType as any
    ];

    if (redeemType === 'Target') {
      _params[1] = {
        Target: form.values.target
      };
    }

    return _params;
  };

  return (
    <Grid
      className={classes.root}
      direction='column'
    >
      <Grid item>
        <p>Withdraw deposit and interest</p>
      </Grid>
      <Grid item>
        <BalanceInput
          error={!!form.errors.amount}
          id='amount'
          name='amount'
          onChange={form.handleChange}
          token={stakingPool.liquidCurrency}
          value={form.values.amount}
        />
      </Grid>
      <Grid item>
        <div className={classes.select}>
          <Radio
            checked={redeemType === 'Immediately'}
            className={classes.item}
            label='Redeem Now'
            onClick={() => setRedeemType('Immediately')}
          />
          <Radio
            checked={redeemType === 'Target'}
            className={classes.item}
            label={(
              <div className={classes.targetInput}>
                <span>Redeem in ERA</span>
                <TargetRedeemList
                  className={classes.select}
                  onChange={setEra}
                  value={era}
                />
              </div>
            )}
            onClick={() => setRedeemType('Target')}
          />
          <Radio
            checked={redeemType === 'WaitForUnbonding'}
            className={classes.item}
            label='Redeem & Wait for Unbounding Period'
            onClick={() => setRedeemType('WaitForUnbonding')}
          />
        </div>
      </Grid>
      <Grid item>
        <p>
        Current Era = {stakingPoolHelper.currentEra} Unbounding Period = {formtDuration(unbondingDuration)} Days, Era {stakingPoolHelper.bondingDuration}
        </p>
      </Grid>
      <Grid container
        item
        justifyContent='center'>
        <Grid item>
          <TxButton
            className={classes.txBtn}
            disabled={checkDisabled()}
            method='redeem'
            onSuccess={resetForm}
            params={getParams()}
            section='homa'
          >
            Redeem
          </TxButton>
        </Grid>
      </Grid>
      <Grid
        className={clsx(
          classes.info,
          {
            [classes.show]: !!form.values.amount
          }
        )}
        item
      >
        <List config={listConfig}
          data={info} />
      </Grid>
    </Grid>
  );
};
