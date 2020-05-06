import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';
import { useCall, useApi } from '@honzon-platform/react-hooks';
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
  const { api } = useApi();
  const loanTypes = useCall<DerivedLoanType[]>((api.derive as any).loan.allLoanTypes, []) || [];
  const currentLoanType = loanTypes.find((item): boolean => tokenEq(item.token, token));

  if (!currentLoanType) {
    return null;
  }

  let amount = Fixed18.ZERO;

  if (currentLoanType.globalStabilityFee && currentLoanType.stabilityFee) {
    amount = calcStableFeeAPR(
      convertToFixed18(currentLoanType.globalStabilityFee)
        .add(convertToFixed18(currentLoanType.stabilityFee)),
      currentLoanType.expectedBlockTime.toNumber()
    );
  }

  return (
    <FormatFixed18
      className={className}
      data={amount}
      format='percentage'
    />
  );
});
