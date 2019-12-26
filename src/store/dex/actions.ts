import { createAsyncAction, createAction } from 'typesafe-actions';
import FixedU128 from '@/utils/fixed_u128';
import { AssetList, DexLiquidityPoolData } from '@/types/store';

interface SwapCurrencyParam {
    supply: {
        asset: number;
        balance: FixedU128;
    };
    target: {
        asset: number;
        balance: FixedU128;
    };
}

export const SWAP_CURRENCY = '@dex/swap_currency';
export const swapCurrency = createAsyncAction(
    SWAP_CURRENCY,
    '@dex/swap_currency/success',
    '@dex/swap_currency/failure',
)<SwapCurrencyParam, any, string>();

export const reset = createAction('@dex/reset');

export const FETCH_DEX_LIQUIDITY_POOL = '@dex/fetch_dex_liquidity_pool';
export const fetchDexLiquidityPool = createAsyncAction(
    FETCH_DEX_LIQUIDITY_POOL,
    '@dex/fetch_dex_liquidity_pool/success',
    '@dex/fetch_dex_liquidity_pool/failure',
)<AssetList, DexLiquidityPoolData[], string>();
