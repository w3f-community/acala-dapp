import React, { FC, memo, useState, useEffect, useRef, ReactElement } from 'react';
import clsx from 'clsx';
import { Icon } from 'semantic-ui-react';

import { CurrencyId } from '@acala-network/types/interfaces';

import { useApi, useModal } from '@honzon-platform/react-hooks';
import { randomID } from '@honzon-platform/ui-components';
import { Token } from './Token';
import classes from './TokenSelector.module.scss';
import { getAllCurrencyIds } from './utils';

interface Props {
  currencies?: (CurrencyId | string)[];
  onChange?: (token: CurrencyId) => void;
  value?: CurrencyId;
}

export const TokenSelector: FC<Props> = memo(({
  currencies,
  onChange,
  value
}) => {
  const { api } = useApi();
  const _idRef = useRef<string>(randomID());
  const { close, status, toggle } = useModal(false);
  const [selected, setSelected] = useState<number>(-1);
  const currenciesRef = useRef<(CurrencyId)[]>([]);

  const handleActionClick = (): void => {
    toggle();
  };

  const handleTokenSelect = (position: number): void => {
    setSelected(position);
    close();

    if (onChange) {
      onChange(currenciesRef.current[position]);
    }
  };

  // format currencies and set default vlaue if need
  useEffect(() => {
    // set default currencies
    if (!currencies) {
      currenciesRef.current = getAllCurrencyIds(api);
    } else {
      // convert string to CurrencyId
      currenciesRef.current = currencies.map((item: CurrencyId | string): CurrencyId => {
        if (typeof item === 'string') {
          return api.registry.createType('CurrencyId' as any, name) as CurrencyId;
        }

        return item;
      });
    }
  }, [api, currencies]);

  // when value change, set the selected value
  useEffect(() => {
    const position = currenciesRef.current.findIndex((item): boolean => item.eq(value));

    setSelected(position < 0 ? 0 : position);
  }, [value]);

  if (!currenciesRef.current.length) {
    return null;
  }

  return (
    <div className={clsx(classes.root, { [classes.open]: status })}>
      <div
        className={classes.selected}
        onClick={handleActionClick}
      >
        <div className={classes.selectedToken}>
          <Token
            icon
            token={currenciesRef.current[selected]}
          />
        </div>
        <div className={classes.selectedAction}>
          <Icon name='angle down' />
        </div>
      </div>
      <ul className={classes.listContainer}>
        {
          currenciesRef.current.map((token: CurrencyId, index: number): ReactElement => {
            return (
              <li
                className={classes.listItem}
                key={`${_idRef.current}_${index}`}
                onClick={(): void => handleTokenSelect(index)}
              >
                <Token
                  icon
                  token={token}
                />
              </li>
            );
          })
        }
      </ul>
    </div>
  );
});

TokenSelector.displayName = 'TokenSelector';
