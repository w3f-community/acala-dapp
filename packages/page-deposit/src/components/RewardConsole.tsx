import React, { FC, memo, useState, useContext } from 'react';
import { noop } from 'lodash';
import { Card, Button } from '@honzon-platform/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Vec } from '@polkadot/types';
import { BalanceInput, AccountBalance, TxButton } from '@honzon-platform/react-components';
import { useFormik } from 'formik';
import { DepositContext } from './Provider';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import classes from './RewardConsole.module.scss';

interface InputAreaProps {
  currencies?: Vec<CurrencyId>;
  value: number;
  onChange: (eventOrPath: string | React.ChangeEvent<any>) => void
  token: CurrencyId;
}

const InputArea: FC<InputAreaProps> = memo(({
  currencies,
  value,
  onChange,
  token
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Deposit</p>
        {token? <p className={classes.inputAreaBalance}>Balance: <AccountBalance token={token} /> </p> : null}
      </div>
      <BalanceInput
        currencies={currencies}
        enableTokenSelect
        onChange={onChange}
        token={token}
        value={value}
      />
    </div>
  );
});
InputArea.displayName = 'InputArea';

export const RewardConsole: FC = memo(() => {
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
          value={form.values.other as any as number}
          onChange={form.handleChange}
          token={otherCurrency}
          currencies={enabledCurrencyIds}
        />
        <AddIcon className={classes.addIcon} />
        <InputArea
          value={form.values.base as any as number}
          onChange={form.handleChange}
          token={baseCurrencyId}
        />
        <TxButton>
          Deposit
        </TxButton>
      </div>
    </Card>
  );
});

RewardConsole.displayName = 'RewardConsole';
