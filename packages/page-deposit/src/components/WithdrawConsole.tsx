import React, { FC, memo, useState, useContext } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Vec } from '@polkadot/types';
import { Card } from '@honzon-platform/ui-components';
import { CurrencyId, Share } from '@acala-network/types/interfaces';
import { BalanceInput, TxButton, numToFixed18Inner, DexExchangeRate, DexPoolSize, DexUserShare } from '@honzon-platform/react-components';
import { QueryDexShare } from '@honzon-platform/react-query';
import { useAccounts, useFormValidator, useDexShare } from '@honzon-platform/react-hooks';
import { convertToFixed18 } from '@acala-network/app-util';

import { DepositContext } from './Provider';
import { ReactComponent as RightArrowIcon } from '../assets/right-arrow.svg';
import classes from './Withdraw.module.scss';
import { AccountDexTokens } from './AccountDexTokens';

interface InputAreaProps {
  error: string | undefined;
  id: string;
  name: string;
  currencies?: Vec<CurrencyId>;
  value: number;
  onChange: (eventOrPath: string | React.ChangeEvent<any>) => void
  token: CurrencyId;
  share: Share | undefined;
  onTokenChange?: (token: CurrencyId) => void;
}

const InputArea: FC<InputAreaProps> = memo(({
  error,
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
        <p>
          {share ? convertToFixed18(share).toString() : ''}
        </p>
      </div>
      <BalanceInput
        error={!!error}
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
  const { share } = useDexShare(otherCurrency);
  const validator = useFormValidator({
    share: {
      type: 'number',
      min: 0,
      max: share ? convertToFixed18(share).toNumber() : 0
    }
  })
  const form = useFormik({
    initialValues: {
      share: '' as any as number
    },
    validate: validator,
    onSubmit: noop,
  });

  const checkDisabled = () => {
    if (form.values.share && !form.errors.share) {
      return false;
    }
    return true;
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          error={form.errors.share}
          id='share'
          name='share'
          value={form.values.share as any as number}
          onChange={form.handleChange}
          token={otherCurrency}
          currencies={enabledCurrencyIds}
          share={share}
          onTokenChange={setOtherCurrency}
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
          className={classes.txBtn}
          disabled={checkDisabled()}
          section='dex'
          method='withdrawLiquidity'
          params={[otherCurrency, numToFixed18Inner(form.values.share)]}
        >
          Withdraw
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

WithdrawConsole.displayName = 'WithdrawConsole';
