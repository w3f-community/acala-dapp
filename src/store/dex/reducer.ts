import { createReducer } from 'typesafe-actions';
import { DexState } from '../types';
import * as actions from './actions';

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
    .handleAction(actions.reset, state => ({
        ...state,
        swapCurrencyStatus: 'none',
    }))
    .handleAction(actions.fetchDexLiquidityPool.success, (state, action) => ({
        ...state,
        dexLiquidityPool: action.payload,
    }));
