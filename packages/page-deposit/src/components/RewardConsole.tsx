import React, { FC, memo, useContext, useState } from 'react';
import { noop } from 'lodash';
import { Card } from '@honzon-platform/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BalanceInput, TxButton, DexReward } from '@honzon-platform/react-components';
import { useFormik, FastField } from 'formik';
import { DepositContext } from './Provider';
import classes from './RewardConsole.module.scss';
import { useFormValidator, useDexReward } from '@honzon-platform/react-hooks';
import { convertToFixed18 } from '@acala-network/app-util';
import { number } from 'prop-types';

interface InputAreaProps {
  id: string;
  name: string;
  error: any;
  currencies?: CurrencyId[];
  value: number;
  onChange: (eventOrPath: string | React.ChangeEvent<any>) => void
  token: CurrencyId;
}

const InputArea: FC<InputAreaProps> = memo(({
  id,
  name,
  currencies,
  error,
  value,
  onChange,
  token
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Reward</p>
        {
          token? (
            <p className={classes.inputAreaBalance}>
              Balance: <DexReward token={token} />
            </p>
          ) : null
        }
      </div>
      <BalanceInput
        error={!!error}
        id={id}
        name={name}
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
  const { baseCurrencyId, enabledCurrencyIds } = useContext(DepositContext);
  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const { amount } = useDexReward(otherCurrency);
  const validator = useFormValidator({
    value: {
      type: 'number',
      max: amount
    }
  });
  const form = useFormik({
    initialValues: {
      value: '' as any as number,
    },
    validate: validator,
    onSubmit: noop,
  });

  const checkDisabled = (): boolean => {
    if(!form.values.value) {
      return true;
    }

    if (form.errors.value) {
      return true;
    }

    return false;
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          id='value'
          name='value'
          value={form.values.value}
          onChange={form.handleChange}
          token={otherCurrency}
          currencies={enabledCurrencyIds}
          error={form.errors.value}
        />
        <TxButton
          disabled={checkDisabled()}
          className={classes.txBtn}
          method='withdrawIncentiveInterest'
          section='dex'
          params={[]}
        >
          Deposit
        </TxButton>
      </div>
    </Card>
  );
});

RewardConsole.displayName = 'RewardConsole';
