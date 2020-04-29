import { isEmpty } from 'lodash';
import { useApi } from "./useApi";
import { useAccounts } from "./useAccounts";
import { useRef, useEffect, useState } from "react";
import { DerivedUserLoan, DerivedLoanType, DerivedLoanOverView, DerivedPrice } from "@acala-network/api-derive";
import { useCall } from "./useCall";
import { usePrice } from "./usePrice";
import { tokenEq, getValueFromTimestampValue } from "@honzon-platform/react-components";
import { CurrencyId } from "@acala-network/types/interfaces";
import { LoanHelper, convertToFixed18, Fixed18, stableCoinToDebit } from "@acala-network/app-util";

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
  const [currentUserLoanHelper, setCurrentUserLoanHelper] = useState<LoanHelper>({} as LoanHelper);
  const currentUserLoanRef = useRef<DerivedUserLoan>({} as DerivedUserLoan);
  const currentLoanTypeRef = useRef<DerivedLoanType>({} as DerivedLoanType);
  const loans = useCall<DerivedUserLoan[]>((api.derive as any).loan.allLoans, [active ? active.address : '']) || [];
  const loanTypes = useCall<DerivedLoanType[]>((api.derive as any).loan.allLoanTypes, []) || [];
  const prices = usePrice() as DerivedPrice[] || [];

  const [collateral, setCollateral] = useState<number>(0);
  const [debitStableCoin, setDebitStableCoin] = useState<number>(0);

  const stableCoinPrice = prices.find((item): boolean => tokenEq(
    item.token,
    api.consts.cdpEngine.getStableCurrencyId as CurrencyId
  ));

  const currentUserLoan = loans.find((item): boolean => tokenEq(item.token, token));

  const currentLoanType = loanTypes.find((item): boolean => tokenEq(item.token, token));

  const collateralPrice = prices.find((item): boolean => tokenEq(item.token, token));

  useEffect(() => {
    if (currentUserLoan && currentLoanType && collateralPrice && stableCoinPrice) {
      currentUserLoanRef.current = currentUserLoan;
      currentLoanTypeRef.current = currentLoanType;

      const _collateral = convertToFixed18(currentUserLoan.debits).add(Fixed18.fromNatural(collateral));
      const _debit = convertToFixed18(currentUserLoan.debits).add(
        stableCoinToDebit(
          Fixed18.fromNatural(debitStableCoin),
          convertToFixed18(currentLoanType.debitExchangeRate)
        )
      );

      setCurrentUserLoanHelper(
        new LoanHelper({
          collateralPrice: getValueFromTimestampValue(collateralPrice.price),
          collaterals: _collateral,
          debitExchangeRate: currentLoanType.debitExchangeRate,
          debits: _debit,
          expectedBlockTime: currentLoanType.expectedBlockTime.toNumber(),
          globalStableFee: currentLoanType.globalStabilityFee,
          liquidationRatio: currentLoanType.liquidationRatio,
          requiredCollateralRatio: currentLoanType.requiredCollateralRatio,
          stableCoinPrice: getValueFromTimestampValue(stableCoinPrice.price),
          stableFee: currentLoanType.stabilityFee
        })
      )
    }
  }, [currentUserLoan, currentLoanType, collateralPrice, stableCoinPrice, collateral, debitStableCoin]);


  return {
    loans: filterEmptyLoan(loans),
    currentUserLoan,
    currentLoanType,
    collateralPrice,
    stableCoinPrice,
    setCollateral,
    setDebitStableCoin,
    currentUserLoanHelper
  };
}