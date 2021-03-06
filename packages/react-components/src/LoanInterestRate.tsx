import React, { FC } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useLoan } from '@acala-dapp/react-hooks';
import { FormatFixed18 } from './format';

interface Props extends BareProps {
  token: CurrencyId | string;
}

export const LoanInterestRate: FC<Props> = ({
  className,
  token
}) => {
  const { currentUserLoanHelper } = useLoan(token);

  return (
    <FormatFixed18
      className={className}
      data={currentUserLoanHelper?.stableFeeAPR}
      format='percentage'
    />
  );
};
