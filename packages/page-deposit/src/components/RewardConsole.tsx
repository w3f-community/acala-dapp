import React, { FC, memo, useContext, useState } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { TxButton, DexReward, TokenSelector } from '@honzon-platform/react-components';
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
  onTokenChange,
  token
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
          currencies={dexCurrencies}
          onChange={onTokenChange}
          value={token}
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
          currencies={enabledCurrencyIds}
          onTokenChange={setOtherCurrency}
          token={otherCurrency}
        />
        <TxButton
          addon={{
            currency: otherCurrency.toString(),
            amount
          }}
          className={classes.txBtn}
          disabled={checkDisabled()}
          method='withdrawIncentiveInterest'
          params={[otherCurrency]}
          section='dex'
          size='large'
        >
          Withdraw
        </TxButton>
      </div>
    </Card>
  );
});

RewardConsole.displayName = 'RewardConsole';
