import React, { FC, memo, FocusEventHandler, useState, ReactNode } from 'react';
import clsx from 'clsx';

import { CurrencyId } from '@acala-network/types/interfaces';
import { useApi } from '@acala-dapp/react-hooks';
import { BareProps } from '@acala-dapp/ui-components/types';

import { Token } from './Token';
import { TokenSelector } from './TokenSelector';
import { getCurrencyIdFromName } from './utils';
import classes from './BalanceInput.module.scss';
import { Button } from '@acala-dapp/ui-components';

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
  className,
  currencies,
  disabled = false,
  enableTokenSelect = false,
  error,
  id,
  name,
  onChange,
  onMax,
  onTokenChange,
  placeholder,
  showMaxBtn = false,
  token,
  tokenPosition = 'right',
  value
}) => {
  const { api } = useApi();
  const [focused, setFocused] = useState<boolean>(false);

  if (typeof token === 'string') {
    token = getCurrencyIdFromName(api, token);
  }

  const renderToken = (): ReactNode => {
    if (enableTokenSelect) {
      return (
        <TokenSelector
          className={
            clsx(
              classes.tokenSelector,
              classes[tokenPosition]
            )
          }
          currencies={currencies}
          onChange={onTokenChange}
          value={token as CurrencyId}
        />
      );
    }

    return (
      <Token
        className={classes.token}
        token={token}
      />
    );
  };

  const onFocus: FocusEventHandler<HTMLInputElement> = () => {
    setFocused(true);
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    setFocused(false);
  };

  return (
    <div className={
      clsx(
        className,
        classes.root,
        {
          [classes.error]: error,
          [classes.focused]: focused
        }
      )
    }>
      {
        tokenPosition === 'left' ? renderToken() : null
      }
      <input
        className={classes.input}
        disabled={disabled}
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        type='number'
        value={value}
      />
      {
        showMaxBtn ? (
          <Button
            className={classes.maxBtn}
            color='primary'
            onClick={onMax}
            type='ghost'
          >
            MAX
          </Button>
        ) : null
      }
      {
        tokenPosition === 'right' ? renderToken() : null
      }
    </div>
  );
});

BalanceInput.displayName = 'BalanceInput';
