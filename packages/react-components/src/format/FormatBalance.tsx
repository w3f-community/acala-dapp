import React, { FC, memo, useRef } from 'react';
import { compose, curry, placeholder } from 'lodash/fp';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';

import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';
import { randomID } from '@honzon-platform/ui-components';

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
  const renderBalance = (data: BalancePair, index: number, useThousandth: boolean, dp: number) => {
    let _noop = (i: any): any => i;

    let _transform = compose(
      useThousandth ? thousandth : _noop,
      curry(padEndDecimal)(placeholder, 5)
    );

    const balance = _transform(formatBalance(data?.balance).toNumber(dp, 3)) || '0';

    return (
      <span key={`${_id}-${index}`}>
        {balance}
        {data.currency ? <span>{' '}{formatCurrency(data.currency)}</span> : null}
        {(pairSymbol && index != pairLength - 1) ? <span>{' '}{pairSymbol}{' '}</span> : null}
      </span>
    );
  };

  return (
    <Tooltip
      title={pair ? pair.map((data, index) => renderBalance(data, index, false, 18)) : renderBalance({ balance, currency }, -1, false, 18)}
      placement='left'
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
        {pair ? pair.map((data, index) => renderBalance(data, index, true, 5)) : renderBalance({ balance, currency }, -1, true, 5)}
      </span>
    </Tooltip>
  );
});

FormatBalance.displayName = 'FormatBalance';
