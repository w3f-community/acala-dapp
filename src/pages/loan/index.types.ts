export interface Vault {
    asset: number;
    stabilityFee?: number;
    liquidationRatio?: number;
    liquidationPrice?: number;
    liquidationPenalty?: number;
}

export type CurrentVault = Required<Vault> & { currentCollateralRatio: number };

export interface SystemInfoData {
    aUSDSupply: number;
}

export interface CollateralInfoData {
    liquidationRatio: number;
    stabilityFee: number;
}

export interface TransactionHistoryData {
    asset: number;
    action: string;
    when: number;
    from: string; // TODO: need account id type
    tx: string; // TODO: need tx type
}
