import { createAsyncAction } from 'typesafe-actions';
import { AssetList, BalanceData, UserVaultData } from '../types';
import { KeyringPair } from '@polkadot/keyring/types';

type ImportAccountError = 'no extends found';
export const IMPORT_ACCOUNT = '@account/import_account';
export const importAccount = createAsyncAction(
    IMPORT_ACCOUNT,
    '@account/import_account/success',
    '@account/import_account/failure',
)<string, { address: string }, ImportAccountError>();

export const FETCH_ASSETS_BALANCE = '@account/fetch_assets_balance';
export const fetchAssetsBalance = createAsyncAction(
    FETCH_ASSETS_BALANCE,
    '@account/fetch_assets_balance/success',
    '@account/fetch_assets_balance/failure',
)<AssetList, BalanceData[], any>();

export const FETCH_VAULTS = '@account/fetch_vaults';
export const fetchVaults = createAsyncAction(
    FETCH_VAULTS,
    '@account/fetch_vaults/success',
    '@account/fetch_vaults/failure',
)<AssetList, UserVaultData[], string>();
