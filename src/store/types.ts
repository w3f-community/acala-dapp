import { ApiRx } from '@polkadot/api';

export type AssetList = number[];

export interface BalanceData {
    asset: number;
    balance: number;
}

export interface PriceData {
    asset: number;
    price: number;
}

export interface BaseVaultData {
    asset: number;
    debitExchangeRate: number;
    liquidationPenalty: number;
    liquidationRatio: number;
    maximumTotalDebitValue: number;
    requiredCollateralRatio: number;
    stabilityFee: number;
}

// store state
export interface ChainState {
    app: ApiRx | null;
    connected: boolean;

    pricesFeed: PriceData[];
    vaults: BaseVaultData[];
}

export interface UserState {
    account: string;
    balancas: BalanceData[];
}
