import React, { createContext, FC, memo, PropsWithChildren, useState, useRef } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { DerivedLoanType, DerivedLoanOverView, DerivedUserLoan, DerivedPrice } from '@acala-network/api-derive';
import { LoanHelper } from '@acala-network/app-util';

import { useCall, useApi, useAccounts } from '@honzon-platform/react-hooks';
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
  const loans = useCall<DerivedUserLoan[]>((api.derive as any).loan.allLoans, [active ? active.address : '', 'aca']);
  const loanTypes = useCall<DerivedLoanType[]>((api.derive as any).loan.allLoanTypess, []);
  const loanOverviews = useCall<DerivedLoanOverView[]>((api.derive as any).loan.allLoanOverviews, []);
  const prices = useCall<DerivedPrice[]>((api.derive as any).price.allPrices, []);

  if (!loans || !loanTypes || !loanOverviews || !prices) {
    return null;
  }

  const setCurrent = (current: CurrencyId): void => {
    const currentUserLoan = loans.find((item): boolean => tokenEq(item.token, current));
    const currentLoanType = loanTypes.find((item): boolean => tokenEq(item.token, current));
    const collateralPrice = prices.find((item): boolean => tokenEq(item.token, current));
    const stableCoinPrice = prices.find((item): boolean => tokenEq(
      item.token,
      api.consts.cdpEngine.getStableCurrencyId as any as CurrencyId
    ));

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

  return (
    <LoanContext.Provider
      value={{
        current,
        currentLoanType: currentLoanTypeRef.current,
        currentUserLoan: currentUserLoanRef.current,
        currentUserLoanHelper: currentUserLoanHelperRef.current,
        loanOverviews,
        loanTypes,
        loans,
        prices,
        setCurrent
      }}
    >
      {children}
    </LoanContext.Provider>
  );
});

LoanProvider.displayName = 'LoanProvider';
