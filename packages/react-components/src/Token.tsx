import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { formatCurrency } from './utils';

interface Props {
  currency: CurrencyId | string;
  upper?: boolean;
}

export const Token: FC<Props> = memo(({ currency, upper = true }) => {
  return (
    <div>{formatCurrency(currency, upper)}</div>
  );
});

Token.displayName = 'Token';
