import React, { FC, memo, useState, useContext } from 'react';
import { noop } from 'lodash';
import { Card, Button } from '@honzon-platform/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Vec } from '@polkadot/types';
import { BalanceInput, AccountBalance, TxButton, numToFixed18Inner } from '@honzon-platform/react-components';
import { useFormik } from 'formik';
import { DepositContext } from './Provider';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import classes from './DepositConsole.module.scss';

interface InputAreaProps {
  id: string;
  name: string;
  currencies?: Vec<CurrencyId>;
  value: number;
  onChange: (eventOrPath: string | React.ChangeEvent<any>) => void
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
  token
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
  const { enabledCurrencyIds, baseCurrencyId } = useContext(DepositContext);
  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const form = useFormik({
    initialValues: {
      other: '',
      base: '',
    },
    onSubmit: noop,
  });
  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          id={'other'}
          name={'other'}
          value={form.values.other as any as number}
          onChange={form.handleChange}
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
          section='dex'
          method='addLiquidity'
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
    </Card>
  );
});

DepositConsole.displayName = 'DepositConsole';
