import React, { FC, memo, useRef } from 'react';
import clsx from 'clsx';


import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';
import { randomID } from '@honzon-platform/ui-components';

import { formatBalance, formatCurrency, thousandth } from '../utils';
import classes from './format.module.scss';

interface BalancePair {
  balance?: BalanceType | Fixed18 | number;
  currency?: CurrencyId | string;
}

interface Props extends BareProps {
  balance?: BalanceType | Fixed18 | number;
  currency?: CurrencyId | string;
  pair?: BalancePair[];
  pairSymbol?: string;
  primary?: boolean;
}

export const FormatBalance: FC<Props> = memo(({
  balance,
  className,
  currency,
  pair,
  pairSymbol,
  primary = false
}) => {
  const pairLength = pair ? pair.length : 0;
  const _id = useRef(randomID());

  const renderBalance = (data: BalancePair, index: number) => {
    return (
      <span key={`${_id}-${index}`}>
        {data.balance ? thousandth(formatBalance(data.balance).toNumber()) : '0'}
        {data.currency ? <span>{' '}{formatCurrency(data.currency)}</span> : null}
        {(pairSymbol && index != pairLength - 1) ? <span>{' '}{pairSymbol}{' '}</span> : null}
      </span>
    );
  };

  return (
    <span
      className={
        clsx(
          className,
          {
            [classes.primary]: primary 
          }
        )
      }
    >
      {
        pair ? pair.map(renderBalance) : renderBalance({ balance, currency }, -1)
      }
    </span>
  );
});

FormatBalance.displayName = 'FormatBalance';
