import React, { FC, memo, useContext, ReactElement, ChangeEvent, ReactNode, useState, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, nextTick, IconButton } from '@honzon-platform/ui-components';
import { BalanceInput, TxButton, numToFixed18Inner, DexExchangeRate, UserBalance } from '@honzon-platform/react-components';
import { useFormValidator } from '@honzon-platform/react-hooks';

import classes from './SwapConsole.module.scss';
import { SwapInfo } from './SwapInfo';
import { SlippageInputArea } from './SlippageInputArea';
import { SwapContext } from './SwapProvider';

interface InputAreaProps {
  addon?: ReactNode;
  error: any;
  title: string;
  currencies: (CurrencyId | string)[];
  token: CurrencyId | string;
  onTokenChange: (token: CurrencyId) => void;
  value: number;
  onChange: any;
  inputName: string;
}

const InputArea: FC<InputAreaProps> = memo(({
  addon,
  currencies,
  error,
  inputName,
  onChange,
  onTokenChange,
  title,
  token,
  value
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.title}>
        {title}
      </div>
      <BalanceInput
        className={classes.input}
        currencies={currencies}
        enableTokenSelect
        error={!!error}
        name={inputName}
        onChange={onChange}
        onTokenChange={onTokenChange}
        token={token}
        value={value}
      />
      {addon}
    </div>
  );
});

InputArea.displayName = 'InputArea';

interface SwapBtn {
  onClick: () => void;
}

function SwapBtn ({ onClick }: SwapBtn): ReactElement {
  return (
    <IconButton
      className={classes.swapBtn}
      color='primary'
      icon='swap'
      onClick={onClick}
      size='large'
      type='border'
    />
  );
}

export const SwapConsole: FC = memo(() => {
  const {
    calcSupply,
    calcTarget,
    pool,
    setCurrency,
    supplyCurrencies,
    targetCurrencies,
  } = useContext(SwapContext);
  const [slippage, setSlippage] = useState<number>(0.005);

  const validator = useFormValidator({
    supply: {
      type: 'balance',
      currency: pool.supplyCurrency,
      min: 0,
      max: pool.supplySize
    },
    target: {
      type: 'number',
      max: pool.targetSize,
      min: 0
    }
  });

  const form = useFormik({
    initialValues: {
      supply: '' as any as number,
      target: '' as any as number
    },
    validate: validator,
    onSubmit: noop
  });

  const onSwap = useCallback((): void => {
    setCurrency(pool.targetCurrency, pool.supplyCurrency);
    form.resetForm();
  }, [setCurrency, form]);

  const onSupplyChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);

    calcTarget(pool.supplyCurrency, pool.targetCurrency, value, slippage).then((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });

    form.handleChange(event);
  }, [calcTarget, pool, form]);

  const onTargetChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);

    calcSupply(pool.supplyCurrency, pool.targetCurrency, value, slippage).then((supply) => {
      nextTick(() => form.setFieldValue('supply', supply));
    });

    form.handleChange(event);
  }, [calcSupply, pool, form]);

  const onSlippageChange = useCallback((slippage: number): void => {
    const supply = form.values.supply;
    setSlippage(slippage);
    calcTarget(pool.supplyCurrency, pool.targetCurrency, supply, slippage).then((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });
  }, [setSlippage, calcTarget, pool]);

  const onSupplyTokenChange = useCallback(async (token: CurrencyId): Promise<void> => {
    setCurrency(token, pool.targetCurrency);

    calcSupply(token, pool.targetCurrency, form.values.target, slippage).then((supply) => {
      nextTick(() => form.setFieldValue('supply', supply));
    });
  }, [setCurrency, calcSupply, pool]);

  const onTargetTokenChange = useCallback(async (token: CurrencyId): Promise<void> => {
    await setCurrency(pool.supplyCurrency, token);

    calcTarget(pool.supplyCurrency, token, form.values.supply, slippage).then((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });
  }, [setCurrency, pool, calcTarget]);

  const checkDisabled = useCallback((): boolean => {
    if (form.errors.supply || form.errors.target) {
      return true;
    }

    if (!(form.values.target && form.values.supply)) {
      return true;
    }

    return false;
  }, [form]);

  return (
    <Card className={classes.root}
      padding={false}>
      <div className={classes.main}>
        <InputArea
          currencies={supplyCurrencies}
          error={form.errors.supply}
          inputName='supply'
          onChange={onSupplyChange}
          onTokenChange={onSupplyTokenChange}
          title='Pay With'
          token={pool.supplyCurrency}
          value={form.values.supply as any as number}
        />
        <SwapBtn onClick={onSwap} />
        <InputArea
          addon={
            <div className={classes.addon}>
              <p>Exchange Rate</p>
              <DexExchangeRate
                supply={pool.supplyCurrency}
                target={pool.targetCurrency}
              />
            </div>
          }
          currencies={targetCurrencies}
          error={form.errors.target}
          inputName='target'
          onChange={onTargetChange}
          onTokenChange={onTargetTokenChange}
          title='Receive'
          token={pool.targetCurrency}
          value={form.values.target}
        />
        <TxButton
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='swapCurrency'
          onSuccess={form.resetForm}
          params={
            [
              pool.supplyCurrency,
              numToFixed18Inner(form.values.supply),
              pool.targetCurrency,
              numToFixed18Inner(form.values.target)
            ]
          }
          section='dex'
          size='large'
        >
          Swap
        </TxButton>
      </div>
      <SwapInfo
        slippage={slippage}
        supplyCurrency={pool?.supplyCurrency}
        targetCurrency={pool?.targetCurrency}
        supply={form.values.supply}
        target={form.values.target}
      />
      <SlippageInputArea 
        slippage={slippage}
        onChange={onSlippageChange} 
      />
    </Card>
  );
});

SwapConsole.displayName = 'SwapConsole';
