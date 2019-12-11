import { ApiRx } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

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

export interface Tx {
    type: 'updateVault';
}

export type TxStatus = 'pending' | 'success' | 'failure' | 'none';

export interface UpdateVaultData {
    collateral: number;
    borrow: number;
    asset: number;
}

// store state
export interface ChainState {
    app: ApiRx | null;
    connected: boolean;

    pricesFeed: PriceData[];
    vaults: BaseVaultData[];
}

export interface UserState {
    account: KeyringPair | null;
    balancas: BalanceData[];
}

export interface VaultState {
    updateVaultStatus: TxStatus;
    [T: string]: any;
}
