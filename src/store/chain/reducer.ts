import { createReducer } from 'typesafe-actions';
import { ChainState } from '../types';
import * as actions from './actions';

const initialState: ChainState = {
    app: null,
    connected: false,
    pricesFeed: [],
};

export default createReducer(initialState)
    .handleAction(actions.connectAsync.success, (state, action) => {
        return {
            ...state,
            app: action.payload,
            connected: true,
        };
    })
    .handleAction(actions.fetchPricesFeed.success, (state, action) => {
        return {
            ...state,
            pricesFeed: action.payload,
        };
    });
