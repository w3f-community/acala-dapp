import React, { FC, memo, useRef, ReactElement } from 'react';
import { compose, curry, placeholder } from 'lodash/fp';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';
import { randomID } from '@acala-dapp/ui-components';

import { formatBalance, formatCurrency, thousandth, padEndDecimal } from '../utils';
import classes from './format.module.scss';

export interface BalancePair {
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

  const renderBalance = (data: BalancePair, index: number, useThousandth: boolean, dp: number): ReactElement => {
    const _noop = (i: any): any => i;

    const _transform = compose(
      useThousandth ? thousandth : _noop,
      curry(padEndDecimal)(placeholder, 6)
    );

    const _balance = formatBalance(data?.balance);
    const balance = _balance.isNaN() ? _balance.toString() : _transform(_balance.toNumber(dp, 3));

    return (
      <span key={`${_id}-${index}`}>
        {balance}
        {data.currency ? <span>{' '}{formatCurrency(data.currency)}</span> : null}
        {(pairSymbol && index !== pairLength - 1) ? <span>{' '}{pairSymbol}{' '}</span> : null}
      </span>
    );
  };

  return (
    <Tooltip
      placement='left'
      title={pair ? pair.map((data, index) => renderBalance(data, index, false, 18)) : renderBalance({ balance, currency }, -1, false, 18)}
    >
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
        {pair ? pair.map((data, index) => renderBalance(data, index, true, 6)) : renderBalance({ balance, currency }, -1, true, 6)}
      </span>
    </Tooltip>
  );
});

FormatBalance.displayName = 'FormatBalance';
