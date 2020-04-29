import React, { FC, memo, useContext, ReactElement, ChangeEvent, ReactNode } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, Tag, Button, TagGroup, nextTick } from '@honzon-platform/ui-components';
import { BalanceInput, TxButton, SwapContext, numToFixed18Inner } from '@honzon-platform/react-components';
import { useFormValidator } from '@honzon-platform/react-hooks';
import { convertToFixed18 } from '@acala-network/app-util';

import { ReactComponent as SwapIcon } from '../assets/swap.svg';
import classes from './SwapConsole.module.scss';
import { SwapInfo } from './SwapInfo';
import { DexExchangeRate } from './DexExchangeRate';
import { SlippageInputArea } from './SlippageInputArea';

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
      <p className={classes.title}>{title}</p>
      <BalanceInput
        enableTokenSelect
        error={!!error}
        currencies={currencies}
        className={classes.input}
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
    <Button
      className={classes.swapBtn}
      onClick={onClick}
      color='normal'
    >
      <SwapIcon />
    </Button>
  );
}

export const SwapConsole: FC = memo(() => {
  const {
    slippage,
    supplyCurrencies,
    targetCurrencies,
    calcSupply,
    calcTarget,
    setSupplyCurrency,
    setTargetCurrency,
    supplyCurrency,
    targetCurrency,
    supplyPool, 
  } = useContext(SwapContext);
  const validator = useFormValidator({
    supply: {
      type: 'balance',
      currency: supplyCurrency,
      min: 0,
      max: supplyPool ? convertToFixed18(supplyPool.other).toNumber() : 0,
    },
    target: {
      type: 'number',
      max: supplyPool ? convertToFixed18(supplyPool.base).toNumber() : 0,
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


  const onSwap = (): void => {
    setSupplyCurrency(targetCurrency);
    setTargetCurrency(supplyCurrency);
    form.resetForm();
  };

  const onSupplyChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);

    calcTarget(value, slippage).then((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });

    form.handleChange(event);
  };

  const onTargetChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);

    calcSupply(value, slippage).then((supply) => {
      nextTick(() => form.setFieldValue('supply', supply));
    });

    form.handleChange(event);
  };

  const onSlippageChange = (slippage: number): void => {
    const supply = form.values.supply;

    calcTarget(supply, slippage).then((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });
  }

  const onSupplyTokenChange = (token: CurrencyId): void => {
    setSupplyCurrency(token);
    // reset form when supply token change
    form.resetForm();
  };

  const onTargetTokenChange = (token: CurrencyId): void => {
    setTargetCurrency(token, () => {
      const supply = form.values.supply;

      calcTarget(supply, slippage).then((target) => {
        form.setFieldValue('target', target)
      });
    });
  };

  const checkDisabled = (): boolean => {
    if (form.errors.supply || form.errors.target) {
      return true;
    }
    if (!(form.values.target && form.values.supply)) {
      return true;
    }
    return false;
  }

  return (
    <Card className={classes.root} gutter={false}>
      <div className={classes.main}>
        <InputArea
          error={form.errors.supply}
          inputName='supply'
          onChange={onSupplyChange}
          currencies={supplyCurrencies}
          onTokenChange={onSupplyTokenChange}
          title='Pay With'
          token={supplyCurrency}
          value={form.values.supply as any as number}
        />
        <SwapBtn onClick={onSwap} />
        <InputArea
          addon={
            <div className={classes.addon}>
              <p>Exchange Rate</p>
              <DexExchangeRate />
            </div>
          }
          inputName='target'
          onChange={onTargetChange}
          currencies={targetCurrencies}
          onTokenChange={onTargetTokenChange}
          title='Receive'
          token={targetCurrency}
          value={form.values.target as any as number}
          error={form.errors.target}
        />
        <TxButton
          size='large'
          className={classes.txBtn}
          method='swapCurrency'
          params={
            [
              supplyCurrency,
              numToFixed18Inner(form.values.supply),
              targetCurrency,
              numToFixed18Inner(form.values.target)
            ]
          }
          section='dex'
          disabled={checkDisabled()}
        >
          Swap
        </TxButton>
      </div>
      <SwapInfo
        supply={form.values.supply}
        target={form.values.target}
      />
      <SlippageInputArea onChange={onSlippageChange} />
    </Card>
  );
});

SwapConsole.displayName = 'SwapConsole';
