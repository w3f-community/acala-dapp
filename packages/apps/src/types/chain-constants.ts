import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';

export interface CdpEngine {
    collateralCurrencyIds: string[];
    defaultDebitExchangeRate: FixedU128;
    defaultLiquidationRatio: FixedU128;
    stableCurrencyId: string;
    globalStabilityFee: FixedU128;
    maxSlippageSwapWithDex: FixedU128;
    minimumDebitValue: FixedU128;
}

export interface Babe {
    expectedBlockTime: number;
}

export type Constants = {
    cdpEngine: CdpEngine;
    babe: Babe;
};
