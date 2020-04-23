import React, { FC } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId } from '@acala-network/types/interfaces';
import { useCall, usePrice } from '@honzon-platform/react-hooks';
import { DerivedPrice } from '@acala-network/api-derive';
import { useApi } from '@honzon-platform/react-hooks';
import { useAccounts } from '@honzon-platform/react-hooks';

interface Props {
  account?: AccountId | string;
  allToken?: boolean;
  token?: CurrencyId | string;
  withPrice?: boolean;
}

export const DexUserDeposit: FC<Props> = ({
  account,
  allToken,
  token,
  withPrice
}) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const price = usePrice();
}