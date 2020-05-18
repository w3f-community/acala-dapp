import React, { FC, memo, useState, useContext, useEffect, useCallback } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { Vec } from '@polkadot/types';
import { Card } from '@honzon-platform/ui-components';
import { CurrencyId, Share } from '@acala-network/types/interfaces';
import { BalanceInput, TxButton, numToFixed18Inner, DexExchangeRate, DexPoolSize, DexUserShare } from '@honzon-platform/react-components';
import { useFormValidator, useDexShare } from '@honzon-platform/react-hooks';
import { convertToFixed18 } from '@acala-network/app-util';

import { DepositContext } from './Provider';
import { ReactComponent as RightArrowIcon } from '../assets/right-arrow.svg';
import classes from './Withdraw.module.scss';
import { AccountDexTokens } from './AccountDexTokens';
import { useDexWithdrawShare } from './useDexWithdrawShare';

interface InputAreaProps {
  error: string | undefined;
  id: string;
  name: string;
  currencies?: Vec<CurrencyId>;
  value: number;
  onChange: (eventOrPath: string | React.ChangeEvent<any>) => void;
  token: CurrencyId;
  share: Share | undefined;
  onTokenChange?: (token: CurrencyId) => void;
}

const InputArea: FC<InputAreaProps> = memo(({
  currencies,
  error,
  id,
  name,
  onChange,
  onTokenChange,
  share,
  token,
  value
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Pool Shares</p>
        <p>
          Balance: {share ? convertToFixed18(share).toString() : ''}
        </p>
      </div>
      <BalanceInput
        currencies={currencies}
        enableTokenSelect
        error={!!error}
        id={id}
        name={name}
        onChange={onChange}
        onTokenChange={onTokenChange}
        token={token}
        value={value}
      />
    </div>
  );
});

InputArea.displayName = 'InputArea';

export const WithdrawConsole: FC = memo(() => {
  const { enabledCurrencyIds } = useContext(DepositContext);
  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const { share } = useDexShare(otherCurrency);
  const validator = useFormValidator({
    share: {
      type: 'number',
      min: 0,
      max: share ? convertToFixed18(share).toNumber() : 0
    }
  });
  const form = useFormik({
    initialValues: {
      share: '' as any as number
    },
    validate: validator,
    onSubmit: noop
  });
  const withdrawTokens = useDexWithdrawShare(otherCurrency, form.values.share);
  const _withdrawToken = withdrawTokens.map(item => ({ balance: item.balance?.toNumber(), currency: item.currency?.toString()}));
  const checkDisabled = () => {
    if (form.values.share && !form.errors.share) {
      return false;
    }

    return true;
  };

  const handleSuccess = useCallback(() => {
    form.resetForm();
  }, [form]);

  useEffect(() => {
    form.resetForm();
  }, [otherCurrency])

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          currencies={enabledCurrencyIds}
          error={form.errors.share}
          id='share'
          name='share'
          onChange={form.handleChange}
          onTokenChange={setOtherCurrency}
          share={share}
          token={otherCurrency}
          value={form.values.share}
        />
        <RightArrowIcon className={classes.arrowIcon} />
        <div className={classes.output}>
          <div className={classes.outputTitle}>
            <p>Output: Liquidity + Reward</p>
          </div>
          <div className={classes.outputContent}>
            {
              form.values.share ? (
                <AccountDexTokens
                  token={otherCurrency}
                  withdraw={form.values.share}
                />) : null
            }
          </div>
        </div>
        <TxButton
          addon={_withdrawToken}
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='withdrawLiquidity'
          params={[otherCurrency, numToFixed18Inner(form.values.share)]}
          section='dex'
          size='large'
          onSuccess={handleSuccess}
        >
          Withdraw
        </TxButton>
      </div>
      <div>
        <ul className={classes.addon}>
          <li className={classes.addonItem}>
            <span>Exchange Rate</span>
            <DexExchangeRate supply={otherCurrency} />
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
