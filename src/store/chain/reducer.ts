import { createReducer } from 'typesafe-actions';
import { ChainState } from '../types';
import * as actions from './actions';

const initialState: ChainState = {
    app: null,
    connected: false,
    pricesFeed: [],
    vaults: [],
    totalIssuance: [],
};

export default createReducer(initialState)
    .handleAction(actions.connectAsync.success, (state, action) => {
        return {
            ...state,
            app: action.payload,
            connected: true,
        };
    })
    .handleAction(actions.fetchPricesFeed.success, (state, action) => ({
        ...state,
        pricesFeed: action.payload,
    }))
    .handleAction(actions.fetchVaults.success, (state, action) => ({
        ...state,
        vaults: action.payload,
    }))
    .handleAction(actions.fetchTotalIssuance.success, (state, action) => ({
        ...state,
        totalIssuance: action.payload,
    }));
