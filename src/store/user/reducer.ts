import { createReducer } from 'typesafe-actions';
import { UserState } from '../types';
import * as actions from './actions';

const initialState: UserState = {
    account: null,
    balancas: [],
    vaults: [],
};

export default createReducer(initialState)
    .handleAction(actions.fetchAssetsBalance.success, (state, action) => ({
        ...state,
        balancas: action.payload,
    }))
    .handleAction(actions.importAccount.success, (state, action) => ({
        ...state,
        account: action.payload,
    }))
    .handleAction(actions.fetchVaults.success, (state, action) => ({
        ...state,
        vaults: action.payload,
    }));
