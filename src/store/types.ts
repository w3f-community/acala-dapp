import { ApiRx } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import FixedU128 from '@/utils/fixed_u128';

export type AssetList = number[];

export interface BalanceData {
    asset: number;
    balance: FixedU128;
}

export interface IssuanceData {
    asset: number;
    issuance: FixedU128;
}

export interface PriceData {
    asset: number;
    price: FixedU128;
}

export interface Account {
    address: string;
}

export interface BaseVaultData {
    asset: number;
    debitExchangeRate: FixedU128;
    liquidationPenalty: FixedU128;
    liquidationRatio: FixedU128;
    maximumTotalDebitValue: FixedU128;
    requiredCollateralRatio: FixedU128;
    stabilityFee: FixedU128;
}

export interface UserVaultData {
    asset: number;
    collateral: FixedU128;
    debit: FixedU128;
}

export interface Tx {
    hash: string;
    type: TxType;
    status: TxStatus;
    time: number;
    data: UpdateVaultData | any; // pls modify, if there is new tx type
}

export type TxType = 'updateVault';
export type TxStatus = 'pending' | 'success' | 'failure' | 'none';

export interface UpdateVaultData {
    asset: number;
    collateral: string;
    debit: string;
}

// store state
export interface AppState {
    txRecord: Tx[];
}
export interface ChainState {
    app: ApiRx | null;
    connected: boolean;

    pricesFeed: PriceData[];
    vaults: BaseVaultData[];
    totalIssuance: IssuanceData[];
}

export interface UserState {
    // account: KeyringPair | null;
    account: Account;
    balancas: BalanceData[];
    vaults: UserVaultData[];
}

export interface VaultState {
    updateVaultStatus: TxStatus;
    [T: string]: any;
}
