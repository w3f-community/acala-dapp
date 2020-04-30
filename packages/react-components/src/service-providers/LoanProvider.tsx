import React, { createContext, FC, memo, PropsWithChildren, useState, useRef } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { DerivedLoanType, DerivedLoanOverView, DerivedUserLoan, DerivedPrice } from '@acala-network/api-derive';
import { LoanHelper } from '@acala-network/app-util';

import { useCall, useApi, useAccounts, usePrice, useConstants } from '@honzon-platform/react-hooks';
import { tokenEq, getValueFromTimestampValue } from '../utils';

interface ContextData {
  current: CurrencyId | null; // current loan token
  currentUserLoan: DerivedUserLoan;
  currentUserLoanHelper: LoanHelper;
  currentLoanType: DerivedLoanType;
  loanTypes: DerivedLoanType[];
  loanOverviews: DerivedLoanOverView[];
  loans: DerivedUserLoan[];
  prices: DerivedPrice[];
  setCurrent: (current: CurrencyId) => void; // set current loan token
}

export const LoanContext = createContext<ContextData>({} as ContextData);

export const LoanProvider: FC<PropsWithChildren<{}>> = memo(({ children }) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const [current, _setCurrent] = useState<CurrencyId | null>(null);
  const currentUserLoanHelperRef = useRef<LoanHelper>({} as LoanHelper);
  const currentUserLoanRef = useRef<DerivedUserLoan>({} as DerivedUserLoan);
  const currentLoanTypeRef = useRef<DerivedLoanType>({} as DerivedLoanType);
  const loans = useCall<DerivedUserLoan[]>((api.derive as any).loan.allLoans, [active ? active.address : '']) || [];
  const loanTypes = useCall<DerivedLoanType[]>((api.derive as any).loan.allLoanTypes, []) || [];
  const loanOverviews = useCall<DerivedLoanOverView[]>((api.derive as any).loan.allLoanOverviews, []) || [];
  const prices = usePrice() as DerivedPrice[] || [];
  const { stableCurrency } = useConstants();

  const setCurrent = (current: CurrencyId): void => {
    if (!loans || !loanTypes || !loanOverviews || !prices) {
      return;
    }

    const currentUserLoan = loans.find((item): boolean => tokenEq(item.token, current));
    const currentLoanType = loanTypes.find((item): boolean => tokenEq(item.token, current));
    const collateralPrice = prices.find((item): boolean => tokenEq(item.token, current));
    const stableCoinPrice = prices.find((item): boolean => tokenEq(item.token, stableCurrency));

    if (currentUserLoan && currentLoanType && collateralPrice && stableCoinPrice) {
      currentUserLoanRef.current = currentUserLoan;
      currentLoanTypeRef.current = currentLoanType;
      currentUserLoanHelperRef.current = new LoanHelper({
        collateralPrice: getValueFromTimestampValue(collateralPrice.price),
        collaterals: currentUserLoan.collaterals,
        debitExchangeRate: currentLoanType.debitExchangeRate,
        debits: currentUserLoan.debits,
        expectedBlockTime: currentLoanType.expectedBlockTime.toNumber(),
        globalStableFee: currentLoanType.globalStabilityFee,
        liquidationRatio: currentLoanType.liquidationRatio,
        requiredCollateralRatio: currentLoanType.requiredCollateralRatio,
        stableCoinPrice: getValueFromTimestampValue(stableCoinPrice.price),
        stableFee: currentLoanType.stabilityFee
      });
    }

    _setCurrent(current);
  };

  const filterEmptyLoan = (loans: DerivedUserLoan[]) => {
    return loans.filter((item) => {
      return !item.collaterals.isEmpty && !item.debits.isEmpty;
    });
  };
 
  return (
    <LoanContext.Provider
      value={{
        current,
        currentLoanType: currentLoanTypeRef.current,
        currentUserLoan: currentUserLoanRef.current,
        currentUserLoanHelper: currentUserLoanHelperRef.current,
        loanOverviews,
        loanTypes,
        loans: filterEmptyLoan(loans),
        prices,
        setCurrent
      }}
    >
      {children}
    </LoanContext.Provider>);
});

LoanProvider.displayName = 'LoanProvider';
