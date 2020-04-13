import React, { FC } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { formatCurrency } from './utils';

interface Props {
  currency: CurrencyId | string;
  icon?: boolean;
  upper?: boolean;
}

export const Token: FC<Props> = ({ currency, icon = false, upper = true }) => {
  return (
    <div>{formatCurrency(currency, upper)}</div>
  );
}