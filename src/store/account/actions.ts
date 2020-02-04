import { createAsyncAction } from 'typesafe-actions';
import { AssetList, BalanceData, UserVaultData, Account, AccountError } from '@/types/store';

export const IMPORT_ACCOUNT = '@account/import_account';
export const importAccount = createAsyncAction(
    IMPORT_ACCOUNT,
    '@account/import_account/success',
    '@account/import_account/failure',
)<string, Account[], AccountError>();

export const SELECT_ACCOUNT = '@account/select_account';
export const selectAccount = createAsyncAction(
    SELECT_ACCOUNT,
    '@account/select_account/success',
    '@account/select_account/failure',
)<number, Account, AccountError>();

export const FETCH_ASSETS_BALANCE = '@account/fetch_assets_balance';
export const fetchAssetsBalance = createAsyncAction(
    FETCH_ASSETS_BALANCE,
    '@account/fetch_assets_balance/success',
    '@account/fetch_assets_balance/failure',
)<AssetList, BalanceData[], any>();
