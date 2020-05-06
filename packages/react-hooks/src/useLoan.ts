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
import { useConstants } from './useConstants';

export const filterEmptyLoan = (loans: DerivedUserLoan[] | null): DerivedUserLoan[]=> {
  if (!loans) {
    return [];
  }

  return loans.filter((item) => {
    return !(item.collaterals.isEmpty && item.debits.isEmpty);
  });
};

export const useAllLoans = () => {
  const { api } = useApi();
  const { active } = useAccounts();
  const loans = useCall<DerivedUserLoan[]>((api.derive as any).loan.allLoans, [active ? active.address : '']) || null;
  const loanTypes = useCall<DerivedLoanType[]>((api.derive as any).loan.allLoanTypes, []) || [];
  const loanOverviews = useCall<DerivedLoanOverView[]>((api.derive as any).loan.allLoanOverviews, []) || [];

  return {
    loans,
    loanTypes,
    loanOverviews
  }
};

export const useLoan = (token: CurrencyId | string, callback?: () => void) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const currentUserLoanRef = useRef<DerivedUserLoan>({} as DerivedUserLoan);
  const currentLoanTypeRef = useRef<DerivedLoanType>({} as DerivedLoanType);
  const loans = useCall<DerivedUserLoan[]>((api.derive as any).loan.allLoans, [active ? active.address : '']) || [];
  const loanTypes = useCall<DerivedLoanType[]>((api.derive as any).loan.allLoanTypes, []) || [];
  const prices = usePrice() as DerivedPrice[] || [];
  const [currentUserLoanHelper, setCurrentUserLoanHelper] = useState<LoanHelper>({} as LoanHelper);
  const { stableCurrency } = useConstants();
  const minmumDebitValue = useRef<Fixed18>(convertToFixed18(api.consts.cdpEngine.minimumDebitValue));

  const [collateral, setCollateral] = useState<number>(0);
  const [debitStableCoin, setDebitStableCoin] = useState<number>(0);

  const stableCoinPrice = prices.find((item): boolean => tokenEq(item.token, stableCurrency));

  const currentUserLoan = loans.find((item): boolean => tokenEq(item.token, token));

  const currentLoanType = loanTypes.find((item): boolean => tokenEq(item.token, token));

  const collateralPrice = prices.find((item): boolean => tokenEq(item.token, token));

  const getCurrentUserLoanHelper = (): LoanHelper => {
    if (currentUserLoan && currentLoanType && collateralPrice && stableCoinPrice) {
      currentUserLoanRef.current = currentUserLoan;
      currentLoanTypeRef.current = currentLoanType;

      const _collateral = convertToFixed18(currentUserLoan.collaterals).add(Fixed18.fromNatural(collateral));
      const _debit = convertToFixed18(currentUserLoan.debits).add(
        stableCoinToDebit(
          Fixed18.fromNatural(debitStableCoin),
          convertToFixed18(currentLoanType.debitExchangeRate)
        )
      );

      return new LoanHelper({
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
      });
    }
    return {} as LoanHelper;
  };

  useEffect(() => {
    if (currentUserLoan && currentLoanType && collateralPrice && stableCoinPrice) {
      currentUserLoanRef.current = currentUserLoan;
      currentLoanTypeRef.current = currentLoanType;

      const _collateral = convertToFixed18(currentUserLoan.collaterals).add(Fixed18.fromNatural(collateral));
      const _debit = convertToFixed18(currentUserLoan.debits).add(
        stableCoinToDebit(
          Fixed18.fromNatural(debitStableCoin),
          convertToFixed18(currentLoanType.debitExchangeRate)
        )
      );
      setCurrentUserLoanHelper(new LoanHelper({
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
      }));
    }
  }, [currentUserLoan, currentLoanType, collateralPrice, stableCoinPrice, collateral, debitStableCoin]);

  useEffect(() => {
    callback && callback();
  }, [stableCoinPrice, loans, loanTypes, prices]); 

  return {
    loans,
    currentUserLoan,
    currentLoanType,
    collateralPrice,
    stableCoinPrice,
    setCollateral,
    setDebitStableCoin,
    getCurrentUserLoanHelper,
    currentUserLoanHelper,
    setCurrentUserLoanHelper,
    minmumDebitValue: minmumDebitValue.current,
    collateral,
    debitStableCoin,
  };
}