import { FC } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId, Balance } from '@acala-network/types/interfaces';

import { useApi } from '@honzon-platform/react-hooks/useApi';
import { useCall } from '@honzon-platform/react-hooks/useCall';

import { BaseQueryElementProps } from './type';

type Props = {
  account: AccountId | string;
  token: CurrencyId | string;
} & BaseQueryElementProps<Balance>;

export const QueryBalance: FC<Props> = ({ account, token, render }) => {
  const { api } = useApi();
  // FIXME: need fix api-derive type
  const result = useCall<Balance>((api.derive as any).currencies.balance, [account, token]);

  if (result) {
    return render(result);
  }

  return null;
};
