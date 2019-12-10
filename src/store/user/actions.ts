import { createAsyncAction } from 'typesafe-actions';
import { AssetList, BalanceData } from '../types';

export const FETCH_ASSETS_BALANCE = '@chain/fetch_assets_balance';
export const fetchAssetsBalance = createAsyncAction(
    FETCH_ASSETS_BALANCE,
    '@user/fetch_assets_balance/success',
    '@user/fetch_assets_balance/failure',
)<AssetList, BalanceData[], any>();
