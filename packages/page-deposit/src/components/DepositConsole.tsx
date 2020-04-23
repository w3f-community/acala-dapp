import React, { FC, memo, useState, useContext, ReactNode } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, nextTick } from '@honzon-platform/ui-components';
import { useAccounts, useDexExchangeRate, useFormValidator } from '@honzon-platform/react-hooks';
import { BalanceInput, TxButton, numToFixed18Inner, DexExchangeRate, DexPoolSize, DexUserShare, UserBalance } from '@honzon-platform/react-components';

import classes from './DepositConsole.module.scss';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import { DepositContext } from './Provider';
import { Fixed18 } from '@acala-network/app-util';

interface InputAreaProps {
  disabled?: boolean;
  error: any;
  id: string;
  name: string;
  currencies?: (CurrencyId | string)[];
  value: number;
  onChange: (event: React.ChangeEvent<any>) => void
  token: CurrencyId;
  onTokenChange?: (token: CurrencyId) => void;
}

const InputArea: FC<InputAreaProps> = memo(({
  disabled,
  error,
  id,
  name,
  currencies,
  value,
  onChange,
  onTokenChange,
  token,
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Deposit</p>
        {token? <p className={classes.inputAreaBalance}>Balance: <UserBalance token={token} /> </p> : null}
      </div>
      <BalanceInput
        disabled={disabled}
        id={id}
        name={name}
        currencies={currencies}
        enableTokenSelect
        onChange={onChange}
        token={token}
        value={value}
        onTokenChange={onTokenChange}
        error={!!error}
      />
    </div>
  );
});
InputArea.displayName = 'InputArea';

export const DepositConsole: FC = memo(() => {
  const { active } = useAccounts();
  const { enabledCurrencyIds, baseCurrencyId } = useContext(DepositContext);
  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const { rate } = useDexExchangeRate(otherCurrency);
  const validator = useFormValidator({
    other: {
      type: 'balance',
      currency: otherCurrency,
      min: 0
    },
    base: {
      type: 'balance',
      currency: baseCurrencyId,
      min: 0
    }
  });
  const form = useFormik({
    initialValues: {
      other: '',
      base: '',
    },
    validate: validator,
    onSubmit: noop,
  });
  const handleOtherInput = (event: React.ChangeEvent<any>): void => {
    const value = Number(event.target.value);
    form.handleChange(event);
    nextTick(() => { form.setFieldValue('base', Fixed18.fromNatural(value).mul(rate).toNumber()) });
  };
  const handleSuccess = () => {
    // reset form
    form.resetForm();
  };
  const checkDisabled = () => {
    if (!(form.values.base && form.values.other)) {
      return true;
    }
    if (form.errors.base || form.errors.other) {
      return true;
    }
    return false;
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          error={form.errors.other}
          id={'other'}
          name={'other'}
          value={form.values.other as any as number}
          onChange={handleOtherInput}
          token={otherCurrency}
          currencies={enabledCurrencyIds}
          onTokenChange={setOtherCurrency}
        />
        <AddIcon className={classes.addIcon} />
        <InputArea
          error={form.errors.base}
          id={'base'}
          name={'base'}
          value={form.values.base as any as number}
          onChange={form.handleChange}
          currencies={[baseCurrencyId]}
          token={baseCurrencyId}
        />
        <TxButton
          disabled={checkDisabled()}
          className={classes.txBtn}
          section='dex'
          method='addLiquidity'
          onSuccess={handleSuccess}
          params={
            [
              otherCurrency,
              numToFixed18Inner(form.values.other),
              numToFixed18Inner(form.values.base)
            ]
          }
        >
          Deposit
        </TxButton>
      </div>
      <div>
        <ul className={classes.addon}>
          <li className={classes.addonItem}>
            <span>Exchange Rate</span>
            <DexExchangeRate token={otherCurrency} />
          </li>
          <li className={classes.addonItem}>
            <span>Current Pool Size</span>
            <DexPoolSize token={otherCurrency} />
          </li>
          <li className={classes.addonItem}>
            <span>Your Pool Share(%)</span>
            <DexUserShare token={otherCurrency} />
          </li>
        </ul>
      </div>
    </Card>
  );
});

DepositConsole.displayName = 'DepositConsole';
