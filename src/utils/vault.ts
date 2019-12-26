import FixedU128 from './fixed_u128';

/**
 * requiredCollateralRatio = collateral * collateralPrice / debit * debitExchangeRate * stableCoinPrice
 */

const ZERO = FixedU128.fromNatural(0);

// convert debit to stable coin amount
export function debitToUSD(debit: FixedU128, debitExchangeRate: FixedU128, stableCoinPrice: FixedU128): FixedU128 {
    return debit.mul(debitExchangeRate).mul(stableCoinPrice);
}

// convert stable coin amount to debits
export function USDToDebit(
    stableVaule: FixedU128,
    debitExchangeRate: FixedU128,
    stableCoinPrice: FixedU128,
): FixedU128 {
    if (stableCoinPrice.isZero() || debitExchangeRate.isZero()) {
        return ZERO;
    }
    return stableVaule.div(stableCoinPrice).div(debitExchangeRate);
}

export function debitToStableCoin(debit: FixedU128, debitExchangeRate: FixedU128): FixedU128 {
    return debit.mul(debitExchangeRate);
}

// convert collateral to stable coin amount
export function collateralToUSD(collateral: FixedU128, collateralPrice: FixedU128): FixedU128 {
    return collateral.mul(collateralPrice);
}

export function calcCollateralRatio(collateralVaule: FixedU128, debitVaule: FixedU128): FixedU128 {
    if (debitVaule.isZero()) {
        return ZERO;
    }
    return collateralVaule.div(debitVaule);
}

export function calcStableFee(stableFee: FixedU128): FixedU128 {
    return FixedU128.fromNatural((1 + stableFee.toNumber()) ** ((356 * 24 * 60 * 60) / 4) - 1);
}

export function calcRequiredCollateral(
    debitValue: FixedU128,
    requiredCollateralRatio: FixedU128,
    collateralPrice: FixedU128,
): FixedU128 {
    if (requiredCollateralRatio.isZero() || collateralPrice.isZero()) {
        return ZERO;
    }
    return debitValue.mul(requiredCollateralRatio).div(collateralPrice);
}

export function calcCanGenerater(
    collateralValue: FixedU128,
    debitValue: FixedU128,
    requiredCollateralRatio: FixedU128,
): FixedU128 {
    if (requiredCollateralRatio.isZero()) {
        return ZERO;
    }
    return collateralValue.div(requiredCollateralRatio).sub(debitValue);
}

export function calcLiquidationPrice(
    debitValue: FixedU128,
    requiredCollateralRatio: FixedU128,
    collateral: FixedU128,
): FixedU128 {
    if (collateral.isZero()) {
        return ZERO;
    }
    return debitValue.mul(requiredCollateralRatio).div(collateral);
}

//TODO: need
const EXCHANGE_FEE = FixedU128.fromRational(2, 1000);

// calc other
export function swapToOther(
    baseAmount: FixedU128,
    otherPool: FixedU128,
    basePool: FixedU128,
    isAddExchangeFee: boolean,
): FixedU128 {
    if (otherPool.add(baseAmount).isZero()) {
        return ZERO;
    }

    // (otherPool - otherPool * basePool / (basePool + baseAmount)) * (1 - EXCHANGE_FEE)
    let exchangeFee = FixedU128.fromNatural(1).sub(EXCHANGE_FEE);
    if (isAddExchangeFee) {
        exchangeFee = FixedU128.fromNatural(1).add(EXCHANGE_FEE);
    }
    return otherPool
        .sub(otherPool.mul(basePool).div(basePool.add(baseAmount)))
        .mul(exchangeFee)
        .sub(FixedU128.fromNatural(0.00005));
}

// calc base
export function swapToBase(
    otherAmount: FixedU128,
    otherPool: FixedU128,
    basePool: FixedU128,
    isAddExchangeFee: boolean,
): FixedU128 {
    if (otherAmount.isZero()) {
        return ZERO;
    }
    // (otherPool * basePool / (otherPool - otherAmount) / (1 +- EXCHANGE_FEE)) - basePool
    let exchangeFee = FixedU128.fromNatural(1).sub(EXCHANGE_FEE);
    if (isAddExchangeFee) {
        exchangeFee = FixedU128.fromNatural(1).add(EXCHANGE_FEE);
    }
    return otherPool
        .mul(basePool)
        .div(otherPool.sub(otherAmount).div(exchangeFee))
        .sub(basePool)
        .add(FixedU128.fromNatural(0.00005));
}
