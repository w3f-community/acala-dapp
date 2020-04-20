import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Input } from 'semantic-ui-react';

import { useApi } from '@honzon-platform/react-hooks';

import { Token } from './Token';
import { TokenSelector } from './TokenSelector';
import { getCurrencyIdFromName } from './utils';
import classes from './BalanceInput.module.scss';

interface Props {
  enableTokenSelect?: boolean;
  id?: string;
  name?: string;
  token: CurrencyId | string;
  onChange?: any;
  onTokenChange?: (token: CurrencyId) => void;
  error?: boolean;
  placeholder?: string;
  value?: number;
  currencies?: (CurrencyId | string)[]
}

export const BalanceInput: FC<Props> = memo(({
  currencies,
  enableTokenSelect = false,
  error,
  id,
  name,
  onChange,
  onTokenChange,
  placeholder,
  token,
  value
}) => {
  const { api } = useApi();

  if (typeof token === 'string') {
    token = getCurrencyIdFromName(api, token);
  }

  return (
    <div className={classes.root}>
      <input 
        className={classes.input}
        id={id}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type='number'
        value={value}
      />
      {
        enableTokenSelect
          ? (
            <TokenSelector
              className={classes.tokenSelector}
              onChange={onTokenChange}
              value={token}
              currencies={currencies}
            />
          )
          : <Token token={token} />
      }
    </div>
  );
});

BalanceInput.displayName = 'BalanceInput';
