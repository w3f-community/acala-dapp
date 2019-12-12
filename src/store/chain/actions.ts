import { createAsyncAction, createAction } from 'typesafe-actions';
import { RegistryTypes } from '@polkadot/types/types';
import { ApiRx } from '@polkadot/api';
import { PriceData, BaseVaultData, AssetList, IssuanceData } from '../types';

interface ConnectParam {
    endpoint: string;
    types: RegistryTypes;
}

export const CONNECT_ASYNC = '@chain/connect';
export const connectAsync = createAsyncAction(CONNECT_ASYNC, '@chain/connect/success', '@chain/connnect/failure')<
    ConnectParam,
    ApiRx,
    string
>();

export const FETCH_PRICES_FEED = '@chain/fetch_prices_feed';
export const fetchPricesFeed = createAsyncAction(
    FETCH_PRICES_FEED,
    '@chain/fetch_prices_feed/success',
    '@chain/fetch_prices_feed/failure',
)<AssetList, PriceData[], string>();

export const FETCH_VAULTS = '@chain/fetch_vaults';
export const fetchVaults = createAsyncAction(
    FETCH_VAULTS,
    '@chain/fetch_vaults/success',
    '@chain/fetch_vaults/failure',
)<AssetList, BaseVaultData[], string>();

export const FETCH_TOTAL_ISSUANCE = '@chain/fetch_total_issuance';
export const fetchTotalIssuance = createAsyncAction(
    FETCH_TOTAL_ISSUANCE,
    '@chain/fetch_total_issuance/success',
    '@chain/fetch_total_issuance/failure',
)<AssetList, IssuanceData[], string>();
