import { createReducer } from 'typesafe-actions';
import { AccountState } from '../types';
import * as actions from './actions';

const initialState: AccountState = {
    account: { address: '' },
    balancas: [],
    vaults: [],
    extensionStatus: 'none',
};

export default createReducer(initialState)
    .handleAction(actions.fetchAssetsBalance.success, (state, action) => ({
        ...state,
        balancas: action.payload,
    }))
    .handleAction(actions.importAccount.success, (state, action) => ({
        ...state,
        extensionStatus: 'success',
        account: action.payload,
    }))
    .handleAction(actions.importAccount.failure, (state, action) => {
        if (action.payload === 'no extends found') {
            return {
                ...state,
                extensionStatus: 'failure',
            };
        }
        return state;
    })
    .handleAction(actions.fetchVaults.success, (state, action) => ({
        ...state,
        vaults: action.payload,
    }));
