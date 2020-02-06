import { RootState } from 'typesafe-actions';
import FixedU128 from '@/utils/fixed_u128';
import { ApiRx } from '@polkadot/api';
import { Constants } from './chain_constants';

export type Selector<Result> = (state: RootState) => Result;

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

export interface CdpTypeData {
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
export type TxType = 'updateVault' | 'swapCurrency';
export type TxStatus = Status;
export interface Tx {
    signer: string; // account
    hash: string;
    type: TxType;
    status: TxStatus;
    time: number;
    data: UpdateVaultData | any;
}

// dex
export interface DexLiquidityPoolData {
    asset: number;
    pool: {
        other: FixedU128;
        base: FixedU128;
    };
}

// governace
export interface ProposalData {
    hash: string;
    proposal: {
        method: {
            name: string;
        };
        callIndex: string;
        args: { [k: string]: any };
    };
    vote: {
        index: number;
        threshold: number;
        ayes: string[];
        nays: string[];
    };
}

export interface UpdateVaultData {
    asset: number;
    collateral: FixedU128;
    debit: FixedU128;
}

export type AccountError = 'no extends found' | 'no accounts found' | 'set singer failure' | 'none' | string;

export type AccountState = {
    // extension status
    extensionStatus: Status;

    // account import status
    account: Account | null;
    accountStatus: Status;
    accountList: Account[];

    // account information
    balancas: BalanceData[];

    // account error
    error: AccountError;
};

export interface AppState {
    transactions: Tx[];
}

export interface ChainState {
    app: ApiRx | null;
    connected: boolean;

    pricesFeed: PriceData[];
    cdpTypes: CdpTypeData[];
    totalIssuance: IssuanceData[];
    constants: Constants | null;
}

export interface DexState {
    dexLiquidityPool: DexLiquidityPoolData[];
    swapCurrencyStatus: TxStatus;
    [T: string]: any;
}

export interface VaultState {
    updateVaultStatus: TxStatus;
    txRecord: Tx[];
    [T: string]: any;
    vaults: UserVaultData[];
}

export interface GovernanceState {
    proposals: ProposalData[];
}
