import React, { FC, memo } from 'react';
import AccountId from '@polkadot/types/generic/AccountId';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@honzon-platform/ui-components/types';
import { useCall, useApi, useAccounts, usePrice, useConstants } from '@honzon-platform/react-hooks';
import { DerivedUserLoan, DerivedLoanType, DerivedLoanOverView, DerivedPrice } from '@acala-network/api-derive';
import { FormatFixed18 } from './format';
import { tokenEq, getValueFromTimestampValue } from './utils';
import { calcCollateralRatio, debitToUSD, convertToFixed18, collateralToUSD } from '@acala-network/app-util';

interface Props extends BareProps {
  account?: AccountId | string;
  token: CurrencyId | string;
  withTooltip?: boolean;
}

export const LoanCollateralRate: FC<Props> = memo(({
  account,
  className,
  token,
  withTooltip = true
}) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const _account = account || (active ? active.address : '');
  const loans = useCall<DerivedUserLoan[]>('derive.loan.allLoans', [_account]) || [];
  const loanTypes = useCall<DerivedLoanType[]>('derive.loan.allLoanTypes', []) || [];
  const { stableCurrency } = useConstants();
  const prices = usePrice() as DerivedPrice[] || [];
  const currentUserLoan = loans.find((item): boolean => tokenEq(item.token, token));
  const currentLoanType = loanTypes.find((item): boolean => tokenEq(item.token, token));
  const collateralPrice = prices.find((item): boolean => tokenEq(item.token, token));
  const stableCoinPrice = prices.find((item): boolean => tokenEq(item.token, stableCurrency));

  if (!currentUserLoan || !collateralPrice || !stableCoinPrice || !currentLoanType) {
    return null;
  }

  const amount = calcCollateralRatio(
    collateralToUSD(
      convertToFixed18(currentUserLoan.collaterals),
      convertToFixed18(getValueFromTimestampValue(collateralPrice.price))
    ),
    debitToUSD(
      convertToFixed18(currentUserLoan.debits),
      convertToFixed18(currentLoanType.debitExchangeRate),
      convertToFixed18(getValueFromTimestampValue(stableCoinPrice.price))
    )
  );

  return (
    <FormatFixed18
      className={className}
      data={amount}
      format='percentage'
      withTooltip={withTooltip}
    />
  );
});
