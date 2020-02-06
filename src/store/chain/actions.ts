import { createAsyncAction } from 'typesafe-actions';
import { ApiRx } from '@polkadot/api';
import { PriceData, CdpTypeData, AssetList, IssuanceData } from '@/types/store';
import { Constants } from '@/types/chain_constants';

interface ConnectParam {
    endpoint: string;
    types: any;
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

export const FETCH_CDP_TYPES = '@chain/fetch_cdp_types';
export const fetchCdpTypes = createAsyncAction(
    FETCH_CDP_TYPES,
    '@chain/fetch_cdp_types/success',
    '@chain/fetch_cdp_types/failure',
)<AssetList, CdpTypeData[], string>();

export const FETCH_TOTAL_ISSUANCE = '@chain/fetch_total_issuance';
export const fetchTotalIssuance = createAsyncAction(
    FETCH_TOTAL_ISSUANCE,
    '@chain/fetch_total_issuance/success',
    '@chain/fetch_total_issuance/failure',
)<AssetList, IssuanceData[], string>();

export const FETCH_CONSTANTS = '@chain/fetch_constants';
export const fetchConstants = createAsyncAction(
    FETCH_CONSTANTS,
    '@chain/fetch_constants/success',
    '@chain/fetch_constants/failure',
)<unknown, Constants, string>();
