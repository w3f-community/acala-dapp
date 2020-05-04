import React, { FC, memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { noop } from 'lodash';

import { CurrencyId } from '@acala-network/types/interfaces';

import { BareProps } from '@honzon-platform/ui-components/types';
import { useApi, useConstants } from '@honzon-platform/react-hooks';
import { Dropdown, DropdownConfig } from '@honzon-platform/ui-components';

import { Token } from './Token';
import { getCurrencyIdFromName } from './utils';

interface Props extends BareProps {
  currencies?: (CurrencyId | string)[];
  onChange?: (token: CurrencyId) => void;
  value?: CurrencyId;
}

export const TokenSelector: FC<Props> = memo(({
  className,
  currencies,
  onChange = noop,
  value
}) => {
  const { api } = useApi();
  const [_currencies, setCurrencies] = useState<(CurrencyId)[]>([]);
  const { allCurrencyIds } = useConstants();

  // format currencies and set default vlaue if need
  useEffect(() => {
    // set default currencies
    if (!currencies) {
      setCurrencies(allCurrencyIds);
    } else {
      // convert string to CurrencyId
      const result = currencies.map((item: CurrencyId | string): CurrencyId => {
        if (typeof item === 'string') {
          return getCurrencyIdFromName(api, item);
        }

        return item;
      });
      setCurrencies(result);
    }
  }, [api, currencies]);

  if (!_currencies.length) {
    return null;
  }

  const config: DropdownConfig[] = _currencies.map((currency: CurrencyId) => ({
    value: currency,
    render: () => {
      return (
        <Token
          token={currency}
          icon
        />
      );
    }
  }));

  return (
    <Dropdown
      className={
        clsx(
          className
        )
      }
      value={value}
      config={config}
      onChange={onChange}
    />
  );
});

TokenSelector.displayName = 'TokenSelector';
