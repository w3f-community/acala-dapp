import { createAsyncAction } from 'typesafe-actions';
import { AssetList, BalanceData, UserVaultData } from '../types';
import { KeyringPair } from '@polkadot/keyring/types';

export const IMPORT_ACCOUNT = '@user/import_account';
export const importAccount = createAsyncAction(
    IMPORT_ACCOUNT,
    '@user/import_account/success',
    '@user/import_account/failure',
)<string, { address: string }, string>();

export const FETCH_ASSETS_BALANCE = '@user/fetch_assets_balance';
export const fetchAssetsBalance = createAsyncAction(
    FETCH_ASSETS_BALANCE,
    '@user/fetch_assets_balance/success',
    '@user/fetch_assets_balance/failure',
)<AssetList, BalanceData[], any>();

export const FETCH_VAULTS = '@user/fetch_vaults';
export const fetchVaults = createAsyncAction(FETCH_VAULTS, '@user/fetch_vaults/success', '@user/fetch_vaults/failure')<
    AssetList,
    UserVaultData[],
    string
>();
