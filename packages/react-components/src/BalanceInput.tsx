import React, { FC, memo } from 'react';
import clsx from 'clsx';

import { CurrencyId } from '@acala-network/types/interfaces';
import { useApi } from '@honzon-platform/react-hooks';
import { BareProps } from '@honzon-platform/ui-components/types';

import { Token } from './Token';
import { TokenSelector } from './TokenSelector';
import { getCurrencyIdFromName } from './utils';
import classes from './BalanceInput.module.scss';
import { Button } from '@honzon-platform/ui-components';

interface Props extends BareProps {
  currencies?: (CurrencyId | string)[];
  enableTokenSelect?: boolean;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange?: any;
  onTokenChange?: (token: CurrencyId) => void;
  placeholder?: string;
  token: CurrencyId | string;
  value?: number;
  showMaxBtn?: boolean;
  max?: number;
}

export const BalanceInput: FC<Props> = memo(({
  currencies,
  className,
  disabled = false,
  enableTokenSelect = false,
  error,
  id,
  max = 0,
  showMaxBtn = true,
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
    <div className={
      clsx(
        className,
        classes.root,
        {
          [classes.error]: error
        }
      )
    }>
      <input 
        disabled={disabled}
        className={classes.input}
        id={id}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type='number'
        value={value}
      />
      {
        showMaxBtn ? (
          <Button
            className={classes.maxBtn}
            type='ghost'
            color='primary'
          >
            max
          </Button>
          ): null
      }
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
          : (
            <Token
              className={classes.token}
              token={token}
            />
          )
      }
    </div>
  );
});

BalanceInput.displayName = 'BalanceInput';
