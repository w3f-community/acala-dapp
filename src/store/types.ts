import { ApiRx } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import FixedU128 from '@/utils/fixed_u128';

export type Status = 'none' | 'success' | 'failure' | 'pending';

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
    [other: string]: any;
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

// tx
export interface Tx {
    signer: string; // account
    hash: string;
    type: TxType;
    status: TxStatus;
    time: number;
    data: UpdateVaultData | any; // pls modify, if there is new tx type
}

export type TxType = 'updateVault' | 'swapCurrency';
export type TxStatus = 'pending' | 'success' | 'failure' | 'none';

// dex
export interface DexLiquidityPoolData {
    asset: number;
    pool: FixedU128[];
}

export interface UpdateVaultData {
    asset: number;
    collateral: FixedU128;
    debit: FixedU128;
}

// store state
export interface ChainState {
    app: ApiRx | null;
    connected: boolean;

    pricesFeed: PriceData[];
    vaults: BaseVaultData[];
    totalIssuance: IssuanceData[];
}

export interface DexState {
    dexLiquidityPool: DexLiquidityPoolData[];
    swapCurrencyStatus: TxStatus;
    [T: string]: any;
}
