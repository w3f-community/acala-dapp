import { DerivedUserLoan, DerivedLoanType, DerivedLoanOverView, DerivedPrice } from '@acala-network/api-derive';
import { tokenEq, getValueFromTimestampValue } from '@honzon-platform/react-components';
import { CurrencyId } from '@acala-network/types/interfaces';
import { LoanHelper, convertToFixed18, Fixed18, stableCoinToDebit } from '@acala-network/app-util';

import { useApi } from './useApi';
import { useAccounts } from './useAccounts';
import { useCallback, useMemo } from 'react';
import { useCall } from './useCall';
import { usePrice } from './usePrice';
import { useConstants } from './useConstants';

export const filterEmptyLoan = (loans: DerivedUserLoan[] | null): DerivedUserLoan[] => {
  if (!loans) {
    return [];
  }

  return loans.filter((item) => {
    return !(item.collaterals.isEmpty && item.debits.isEmpty);
  });
};

interface UseAllLoansReturnType {
  loanOverviews: DerivedLoanOverView[];
  loans: DerivedUserLoan[];
  loanTypes: DerivedLoanType[];
}

export const useAllLoans = (): UseAllLoansReturnType => {
  const { active } = useAccounts();
  const loans = useCall<DerivedUserLoan[]>('derive.loan.allLoans', [active ? active.address : '']) || [];
  const loanTypes = useCall<DerivedLoanType[]>('derive.loan.allLoanTypes', []) || [];
  const loanOverviews = useCall<DerivedLoanOverView[]>('derive.loan.allLoanOverviews', []) || [];

  return {
    loanOverviews,
    loanTypes,
    loans
  };
};

interface UseLoanRetrunType {
  collateralPrice: DerivedPrice | undefined;
  stableCoinPrice: DerivedPrice | undefined;
  currentLoanType: DerivedLoanType | undefined;
  currentUserLoan: DerivedUserLoan | undefined;
  currentUserLoanHelper: LoanHelper | null;
  getUserLoanHelper: (loan?: DerivedUserLoan, loanType?: DerivedLoanType, collateral?: number, debitAmount?: number) => LoanHelper | null;
  loans: DerivedUserLoan[];
  minmumDebitValue: Fixed18;
}

export const useLoan = (token: CurrencyId | string): UseLoanRetrunType => {
  const { api } = useApi();
  const { active } = useAccounts();
  const loans = useCall<DerivedUserLoan[]>('derive.loan.allLoans', [active ? active.address : '']) || [];
  const loanTypes = useCall<DerivedLoanType[]>('derive.loan.allLoanTypes', []) || [];
  const prices = usePrice() as DerivedPrice[] || [];
  const { stableCurrency } = useConstants();

  const minmumDebitValue = useMemo<Fixed18>(() => convertToFixed18(api.consts.cdpEngine.minimumDebitValue), [api]);

  const currentUserLoan = useMemo<DerivedUserLoan | undefined>(() => {
    return loans.find((item): boolean => tokenEq(item.token, token));
  }, [loans, token]);

  const currentLoanType = useMemo<DerivedLoanType | undefined>(() => {
    return loanTypes.find((item): boolean => tokenEq(item.token, token));
  }, [loanTypes, token]);

  const stableCoinPrice = useMemo<DerivedPrice | undefined>(() => {
    return prices.find((item): boolean => tokenEq(item.token, stableCurrency));
  }, [prices, stableCurrency]);

  const collateralPrice = useMemo<DerivedPrice | undefined>(() => {
    if (!token) {
      return;
    }

    return prices.find((item): boolean => tokenEq(item.token, token));
  }, [prices, token]);

  const getUserLoanHelper = useCallback((loan?: DerivedUserLoan, loanType?: DerivedLoanType, collateral?: number, debitAmount?: number): LoanHelper | null => {
    if (!loan || !loanType || !stableCoinPrice || !collateralPrice) {
      return null;
    }

    // calcaulte new collateral & debit
    const _collateral = collateral
      ? convertToFixed18(loan.collaterals).add(Fixed18.fromNatural(collateral))
      : convertToFixed18(loan.collaterals);

    const _debit = debitAmount
      ? convertToFixed18(loan.debits)
        .add(stableCoinToDebit(Fixed18.fromNatural(debitAmount), convertToFixed18(loanType.debitExchangeRate)))
      : convertToFixed18(loan.debits);

    return new LoanHelper({
      collateralPrice: getValueFromTimestampValue(collateralPrice.price),
      collaterals: _collateral,
      debitExchangeRate: loanType.debitExchangeRate,
      debits: _debit,
      expectedBlockTime: loanType.expectedBlockTime.toNumber(),
      globalStableFee: loanType.globalStabilityFee,
      liquidationRatio: loanType.liquidationRatio,
      requiredCollateralRatio: loanType.requiredCollateralRatio,
      stableCoinPrice: getValueFromTimestampValue(stableCoinPrice.price),
      stableFee: loanType.stabilityFee
    });
  }, [collateralPrice, stableCoinPrice]);

  const currentUserLoanHelper = useMemo<LoanHelper | null>(() => {
    return getUserLoanHelper(currentUserLoan, currentLoanType);
  }, [currentUserLoan, currentLoanType, getUserLoanHelper]);

  return {
    collateralPrice,
    currentLoanType,
    currentUserLoan,
    currentUserLoanHelper,
    getUserLoanHelper,
    loans,
    minmumDebitValue,
    stableCoinPrice
  };
};
