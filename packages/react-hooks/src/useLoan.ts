import { isEmpty } from 'lodash';
import { useApi } from "./useApi";
import { useAccounts } from "./useAccounts";
import { useRef } from "react";
import { DerivedUserLoan, DerivedLoanType, DerivedLoanOverView, DerivedPrice } from "@acala-network/api-derive";
import { useCall } from "./useCall";
import { usePrice } from "./usePrice";
import { tokenEq, getValueFromTimestampValue } from "@honzon-platform/react-components";
import { CurrencyId } from "@acala-network/types/interfaces";
import { LoanHelper } from "@acala-network/app-util";

const filterEmptyLoan = (loans: DerivedUserLoan[]) => {
  return loans.filter((item) => {
    return !(item.collaterals.isEmpty && item.debits.isEmpty);
  });
};

interface UseAllLoansConfig {
  filterEmpty?: boolean
}

export const useAllLoans = ({ filterEmpty }: UseAllLoansConfig) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const loans = useCall<DerivedUserLoan[]>((api.derive as any).loan.allLoans, [active ? active.address : '']) || [];
  const loanTypes = useCall<DerivedLoanType[]>((api.derive as any).loan.allLoanTypes, []) || [];
  const loanOverviews = useCall<DerivedLoanOverView[]>((api.derive as any).loan.allLoanOverviews, []) || [];

  return {
    loans: filterEmpty ? filterEmptyLoan(loans) : loans,
    loanTypes,
    loanOverviews
  }
};

export const useLoan = (token: CurrencyId | string) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const currentUserLoanHelperRef = useRef<LoanHelper>({} as LoanHelper);
  const currentUserLoanRef = useRef<DerivedUserLoan>({} as DerivedUserLoan);
  const currentLoanTypeRef = useRef<DerivedLoanType>({} as DerivedLoanType);
  const loans = useCall<DerivedUserLoan[]>((api.derive as any).loan.allLoans, [active ? active.address : '']) || [];
  const loanTypes = useCall<DerivedLoanType[]>((api.derive as any).loan.allLoanTypes, []) || [];
  const prices = usePrice() as DerivedPrice[] || [];

  const stableCoinPrice = prices.find((item): boolean => tokenEq(
    item.token,
    api.consts.cdpEngine.getStableCurrencyId as CurrencyId
  ));
  const currentUserLoan = loans.find((item): boolean => tokenEq(item.token, token));
  const currentLoanType = loanTypes.find((item): boolean => tokenEq(item.token, token));
  const collateralPrice = prices.find((item): boolean => tokenEq(item.token, token));

  if (currentUserLoan && currentLoanType && collateralPrice && stableCoinPrice) {
    currentUserLoanRef.current = currentUserLoan;
    currentLoanTypeRef.current = currentLoanType;

    console.log(currentLoanType);
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

  return {
    loans: filterEmptyLoan(loans),
    currentUserLoan,
    currentLoanType,
    collateralPrice,
    stableCoinPrice,
    currentUserLoanHelper: currentUserLoanHelperRef.current
  };
}