import React, { FC } from 'react';
import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { Fixed18 } from '@acala-network/app-util';
import { formatBalance } from '../utils';

interface Props {
  balance: BalanceType | Fixed18 | number
}

export const FormatBalance: FC<Props> = ({ balance }) => {
  return (
    <p>{formatBalance(balance).toString()}</p>
  );
}