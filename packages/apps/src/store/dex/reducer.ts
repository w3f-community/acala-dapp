import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { DexState } from '@honzon-platform/apps/types/store';

const initialState: DexState = {
    swapCurrencyStatus: 'none',
    dexLiquidityPool: [],
};

export default createReducer(initialState)
    .handleAction(actions.swapCurrency.request, state => ({
        ...state,
        swapCurrencyStatus: 'pending',
    }))
    .handleAction(actions.swapCurrency.success, state => ({
        ...state,
        swapCurrencyStatus: 'success',
    }))
    .handleAction(actions.swapCurrency.failure, state => ({
        ...state,
        swapCurrencyStatus: 'failure',
    }))
    .handleAction(actions.reset, state => ({
        ...state,
        swapCurrencyStatus: 'none',
    }))
    .handleAction(actions.fetchDexLiquidityPool.success, (state, action) => ({
        ...state,
        dexLiquidityPool: action.payload,
    }));
