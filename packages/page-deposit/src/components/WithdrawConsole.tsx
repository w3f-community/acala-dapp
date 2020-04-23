import React, { FC, memo, useState, useContext } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Vec } from '@polkadot/types';
import { Card, Button } from '@honzon-platform/ui-components';
import { CurrencyId, Share } from '@acala-network/types/interfaces';
import { BalanceInput, AccountBalance, TxButton, numToFixed18Inner, DexExchangeRate, DexPoolSize } from '@honzon-platform/react-components';
import { QueryDexShare } from '@honzon-platform/react-query';
import { useAccounts } from '@honzon-platform/react-hooks';
import { convertToFixed18 } from '@acala-network/app-util';

import { DepositContext } from './Provider';
import { ReactComponent as RightArrowIcon } from '../assets/right-arrow.svg';
import classes from './Withdraw.module.scss';
import { AccountDexTokens } from './AccountDexTokens';
import { AccountShare } from './AccountShare';

interface InputAreaProps {
  id: string;
  name: string;
  currencies?: Vec<CurrencyId>;
  value: number;
  onChange: (eventOrPath: string | React.ChangeEvent<any>) => void
  token: CurrencyId;
  share: Share;
  onTokenChange?: (token: CurrencyId) => void;
}

const InputArea: FC<InputAreaProps> = memo(({
  id,
  name,
  currencies,
  onChange,
  onTokenChange,
  share,
  token,
  value,
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Share</p>
        {convertToFixed18(share).toString()}
      </div>
      <BalanceInput
        id={id}
        currencies={currencies}
        enableTokenSelect
        onChange={onChange}
        onTokenChange={onTokenChange}
        name={name}
        token={token}
        value={value}
      />
    </div>
  );
});
InputArea.displayName = 'InputArea';

export const WithdrawConsole: FC = memo(() => {
  const { active } = useAccounts();
  const { enabledCurrencyIds, baseCurrencyId } = useContext(DepositContext);
  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const form = useFormik({
    initialValues: {
      share: 0
    },
    onSubmit: noop,
  });
  return (
    <Card>
      <div className={classes.main}>
        <QueryDexShare
          token={otherCurrency}
          account={active!.address}
          render={(result) => (
            <InputArea
              id='share'
              name='share'
              value={form.values.share as any as number}
              onChange={form.handleChange}
              token={otherCurrency}
              currencies={enabledCurrencyIds}
              share={result.share}
              onTokenChange={setOtherCurrency}
            />
          )}
        />
        <RightArrowIcon className={classes.arrowIcon} />
        <AccountDexTokens
            className={classes.output}
            baseCurrencyId={baseCurrencyId}
            token={otherCurrency}
            account={active!.address}
            withdraw={form.values.share}
        />
        <TxButton
          section='dex'
          method='withdrawLiquidity'
          params={[otherCurrency, numToFixed18Inner(form.values.share)]}
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

WithdrawConsole.displayName = 'WithdrawConsole';
