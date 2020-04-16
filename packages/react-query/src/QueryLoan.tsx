import { FC } from 'react';
import { DerivedUserLoan } from '@acala-network/api-derive';
import AccountId from '@polkadot/types/generic/AccountId';
import { useApi } from '@honzon-platform/react-hooks/useApi';
import { useCall } from '@honzon-platform/react-hooks/useCall';
import { BaseQueryElementProps } from './type';

type Props = {
  account: AccountId | 'string';
} & BaseQueryElementProps<DerivedUserLoan>;

export const QueryLoan: FC<Props> = ({ render }) => {
  const { api } = useApi();
  // FIXME: need fix api-derive type
  const loan = useCall<DerivedUserLoan>((api.derive as any).loan.allLoans, []);

  if (loan) {
    return render(loan);
  }

  return null;
};
