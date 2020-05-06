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
  tokenPosition?: 'left' | 'right';
  value?: number;
  showMaxBtn?: boolean;
  onMax?: () => void;
}

export const BalanceInput: FC<Props> = memo(({
  currencies,
  className,
  disabled = false,
  enableTokenSelect = false,
  error,
  id,
  onMax,
  showMaxBtn = false,
  name,
  onChange,
  onTokenChange,
  placeholder,
  tokenPosition = 'right',
  token,
  value
}) => {
  const { api } = useApi();

  if (typeof token === 'string') {
    token = getCurrencyIdFromName(api, token);
  }

  const renderToken = () => {
    if (enableTokenSelect) {
      return (
        <TokenSelector
          className={
            clsx(
              classes.tokenSelector,
              classes[tokenPosition]
            )
          }
          onChange={onTokenChange}
          value={token as CurrencyId}
          currencies={currencies}
        />
      );
    } else {
      <Token
        className={classes.token}
        token={token}
      />
    }
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
      {
        tokenPosition === 'left' ? renderToken() : null
      }
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
            onClick={onMax}
          >
            max
          </Button>
          ): null
      }
      {
        tokenPosition === 'right' ? renderToken() : null
      }
    </div>
  );
});

BalanceInput.displayName = 'BalanceInput';
