import React, { FC, memo, useContext, useState } from 'react';
import { noop } from 'lodash';
import { Card } from '@honzon-platform/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BalanceInput, TxButton, DexReward, TokenSelector } from '@honzon-platform/react-components';
import { useFormik, FastField } from 'formik';
import { DepositContext } from './Provider';
import classes from './RewardConsole.module.scss';
import { useFormValidator, useDexReward, useConstants } from '@honzon-platform/react-hooks';
import { ReactComponent as RightArrowIcon } from '../assets/right-arrow.svg';

interface InputAreaProps {
  currencies?: CurrencyId[];
  token: CurrencyId;
  onTokenChange?: (token: CurrencyId) => void;
}

const InputArea: FC<InputAreaProps> = memo(({
  token,
  onTokenChange,
}) => {
  const { dexCurrencies } = useConstants();
  return (
    <div className={classes.inputAreaRoot}>
      <div className={classes.inputAreaTitle}>
        <p>Reward</p>
      </div>
      <div className={classes.inputAreaContent}>
        <TokenSelector
          className={classes.dropdown}
          value={token}
          currencies={dexCurrencies}
          onChange={onTokenChange}
        />
        <RightArrowIcon className={classes.arrowIcon} />
          <div className={classes.output}>
            <DexReward token={token} />
          </div>
      </div>
    </div>
  );
});
InputArea.displayName = 'InputArea';

export const RewardConsole: FC = memo(() => {
  const { enabledCurrencyIds } = useContext(DepositContext);
  const [otherCurrency, setOtherCurrency] = useState<CurrencyId>(enabledCurrencyIds[0]);
  const { amount } = useDexReward(otherCurrency);

  const checkDisabled = (): boolean => {
    return !amount;
  };

  return (
    <Card>
      <div className={classes.main}>
        <InputArea
          token={otherCurrency}
          currencies={enabledCurrencyIds}
          onTokenChange={setOtherCurrency}
        />
        <TxButton
          size='large'
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='withdrawIncentiveInterest'
          section='dex'
          params={[otherCurrency]}
        >
          Withdraw
        </TxButton>
      </div>
    </Card>
  );
});

RewardConsole.displayName = 'RewardConsole';
