import { FC } from 'react';
import { DerivedUserLoan } from '@acala-network/api-derive/types/loan';
import AccountId from '@polkadot/types/generic/AccountId';
import { useApi } from '@honzon-platform/react-hooks/useApi';
import { useCall } from '@honzon-platform/react-hooks/useCall';
import { BaseQueryElementProps } from './type';

type Props = {
  account: AccountId | 'string';
} & BaseQueryElementProps<DerivedUserLoan>;

export const QueryBalance: FC<Props> = ({ account, render }) => {
  const api = useApi();
  // FIXME: need fix api-derive type
  const loan = useCall<DerivedUserLoan>((api.derive as any).currencies.balances, [account]);

  if (loan) {
    return render(loan);
  }

  return null;
};
