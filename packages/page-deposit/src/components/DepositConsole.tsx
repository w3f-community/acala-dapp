import React, { FC, memo, useState, useContext, ReactNode } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Vec } from '@polkadot/types';

import { Card } from '@honzon-platform/ui-components';
import { useAccounts, useDexExchangeRate } from '@honzon-platform/react-hooks';
import { BalanceInput, AccountBalance, TxButton, numToFixed18Inner, DexExchangeRate, DexPoolSize } from '@honzon-platform/react-components';

import classes from './DepositConsole.module.scss';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import { DepositContext } from './Provider';
import { AccountShare } from './AccountShare';
import { Fixed18 } from '@acala-network/app-util';

interface InputAreaProps {
  id: string;
  name: string;
  currencies?: Vec<CurrencyId>;
  value: number;
  onChange: (event: React.ChangeEvent<any>) => void
  token: CurrencyId;
  onTokenChange?: (token: CurrencyId) => void;
}

const InputArea: FC<InputAreaProps> = memo(({
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
        {token? <p className={classes.inputAreaBalance}>Balance: <AccountBalance token={token} /> </p> : null}
      </div>
      <BalanceInput
        id={id}
        name={name}
        currencies={currencies}
        enableTokenSelect
        onChange={onChange}
        token={token}
        value={value}
        onTokenChange={onTokenChange}
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
  const form = useFormik({
    initialValues: {
      other: '',
      base: '',
    },
    onSubmit: noop,
  });
  const handleOtherInput = (event: React.ChangeEvent<any>): void => {
    const value = Number(event.target.value);
    form.handleChange(event);
    form.setFieldValue('base', Fixed18.fromNatural(value).mul(rate).toNumber());
  };
  const handleSuccess = () => {
    // reset form
    form.resetForm();
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
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
          id={'base'}
          name={'base'}
          value={form.values.base as any as number}
          onChange={form.handleChange}
          token={baseCurrencyId}
        />
        <TxButton
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
            <DexExchangeRate
              token={otherCurrency}
              baseCurrencyId={baseCurrencyId}
            />
          </li>
          <li className={classes.addonItem}>
            <span>Current Pool Size</span>
            <DexPoolSize 
              token={otherCurrency}
              baseCurrencyId={baseCurrencyId}
            />
          </li>
          <li className={classes.addonItem}>
            <span>Your Pool Share(%)</span>
            <AccountShare
              token={otherCurrency}
              account={active!.address}
            />
          </li>
        </ul>
      </div>
    </Card>
  );
});

DepositConsole.displayName = 'DepositConsole';
