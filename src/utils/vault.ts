import FixedU128 from './fixed_u128';

// convert debit to stable coin amount
export function debitToStableCoin(
    debit: FixedU128,
    debitExchangeRate: FixedU128,
    stableCoinPrice: FixedU128,
): FixedU128 {
    return debit.mul(debitExchangeRate).mul(stableCoinPrice);
}

// convert stable coin amount to debits
export function stableCoinToDebit(
    stableVaule: FixedU128,
    debitExchangeRate: FixedU128,
    stableCoinPrice: FixedU128,
): FixedU128 {
    return stableVaule.div(stableCoinPrice).div(debitExchangeRate);
}

export function calcCollateralRatio(
    collateral: FixedU128,
    debit: FixedU128,
    debitExchangeRate: FixedU128,
    collateralPrice: FixedU128,
    stableCoinPrice: FixedU128,
): FixedU128 {
    return collateral.mul(collateralPrice).div(debitToStableCoin(debit, debitExchangeRate, stableCoinPrice));
}

export function calcStableFee(stableFee: FixedU128): FixedU128 {
    return FixedU128.fromNatural((1 + stableFee.toNumber()) ** ((356 * 24 * 60 * 60) / 4) - 1);
}

export function calcRequiredCollateral(collateral: FixedU128, requiredCollateralRatio: FixedU128): FixedU128 {
    return collateral.div(requiredCollateralRatio);
}

export function calcCanGenerater(
    collateral: FixedU128,
    debit: FixedU128,
    requiredCollateralRatio: FixedU128,
    debitExchangeRate: FixedU128,
    collateralPrice: FixedU128,
    stableCoinPrice: FixedU128,
): FixedU128 {
    return collateral
        .sub(calcRequiredCollateral(collateral, requiredCollateralRatio))
        .mul(collateralPrice)
        .sub(debitToStableCoin(debit, debitExchangeRate, stableCoinPrice));
}
