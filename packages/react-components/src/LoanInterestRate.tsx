import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';
import { useCall, useApi, useLoan } from '@honzon-platform/react-hooks';
import { DerivedLoanType } from '@acala-network/api-derive';
import { FormatFixed18 } from './format';
import { tokenEq } from './utils';
import { convertToFixed18, calcStableFeeAPR, Fixed18 } from '@acala-network/app-util';

interface Props extends BareProps {
  token: CurrencyId | string;
}

export const LoanInterestRate: FC<Props> = memo(({
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
});
