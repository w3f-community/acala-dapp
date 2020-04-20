import React, { FC, memo } from 'react';
import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';
import { formatBalance, formatCurrency } from '../utils';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';

interface BalancePair {
  balance?: BalanceType | Fixed18 | number;
  currency?: CurrencyId | string;
}

interface Props extends BareProps {
  balance?: BalanceType | Fixed18 | number;
  currency?: CurrencyId | string;
  pair?: BalancePair[];
  pairSymbol?: string;
}

export const FormatBalance: FC<Props> = memo(({
  balance,
  className,
  currency,
  pair,
  pairSymbol,
}) => {
  const pairLength = pair ? pair.length : 0;
  const renderBalance = (data: BalancePair, index: number) => {
    return (
      <>
        {data.balance ? formatBalance(data.balance).toString() : null}
        {data.currency ? <span>{' '}{formatCurrency(data.currency)}</span> : null}
        {(pairSymbol && index != pairLength - 1) ? <span>{' '}{pairSymbol}{' '}</span> : null}
      </>
    );
  }
  return (
    <span className={className}>
      {
        pair ? pair.map(renderBalance) : renderBalance({ balance, currency }, -1)
      }
    </span>
  );
});

FormatBalance.displayName = 'FormatBalance';
