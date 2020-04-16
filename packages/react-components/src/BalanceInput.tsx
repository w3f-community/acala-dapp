import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Input } from 'semantic-ui-react';
import { useApi } from '@honzon-platform/react-hooks';
import { Token } from './Token';
import { TokenSelector } from './TokenSelector';
import { getCurrencyIdFromName } from './utils';

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
}

export const BalanceInput: FC<Props> = memo(({
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
    <Input
      error={error}
      id={id}
      label={
        enableTokenSelect
          ? (
            <TokenSelector
              onChange={onTokenChange}
              value={token}
            />
          )
          : (
            <Token
              icon
              token={token}
            />
          )
      }
      labelPosition='right'
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      type='number'
      value={value}
    />
  );
});

BalanceInput.displayName = 'BalanceInput';
