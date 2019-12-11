import { createAsyncAction } from 'typesafe-actions';
import { AssetList, BalanceData } from '../types';
import { KeyringPair } from '@polkadot/keyring/types';

export const FETCH_ASSETS_BALANCE = '@user/fetch_assets_balance';
export const fetchAssetsBalance = createAsyncAction(
    FETCH_ASSETS_BALANCE,
    '@user/fetch_assets_balance/success',
    '@user/fetch_assets_balance/failure',
)<AssetList, BalanceData[], any>();

export const IMPORT_ACCOUNT = '@user/import_account';
export const importAccount = createAsyncAction(
    IMPORT_ACCOUNT,
    '@user/import_account/success',
    '@user/import_account/failure',
)<string, KeyringPair, string>();
