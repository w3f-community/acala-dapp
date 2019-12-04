export interface Vault {
    asset: number;
    liquidationRatio?: number;
    stabilityFee?: number;
}

export interface SystemInfoData {
    aUSDSupply: number;
}

export interface CollateralInfoData {
    liquidationRatio: number;
    stabilityFee: number;
}
