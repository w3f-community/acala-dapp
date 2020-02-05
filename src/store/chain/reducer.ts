import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { ChainState } from '@/types/store';

const initialState: ChainState = {
    app: null,
    connected: false,
    pricesFeed: [],
    cdpTypes: [],
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
    .handleAction(actions.fetchCdpTypes.success, (state, action) => ({
        ...state,
        cdpTypes: action.payload,
    }))
    .handleAction(actions.fetchTotalIssuance.success, (state, action) => ({
        ...state,
        totalIssuance: action.payload,
    }));
