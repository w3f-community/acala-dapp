import React, { FC } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { useAccounts, useCall } from '@honzon-platform/react-hooks';
import { FormatBalance } from './format';
import { Balance } from '@acala-network/types/interfaces';

interface Props {
  currency: string;
  account?: AccountId | string;
}

export const AirDropAmount: FC<Props> = ({
  account,
  currency
}) => {
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const result = useCall('query.airDrop.airDrops', [_account, currency]);

  if (!result) {
    return null;
  }

  return (
    <FormatBalance balance={result as Balance} />
  );
};
