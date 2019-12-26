import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { AccountState } from '@/types/store';

const initialState: AccountState = {
    extensionStatus: 'none',

    accountList: [],
    account: null,
    accountStatus: 'none',

    balancas: [],
    vaults: [],

    error: 'none',
};

export default createReducer(initialState)
    .handleAction(actions.fetchAssetsBalance.success, (state, action) => ({
        ...state,
        balancas: action.payload,
    }))
    .handleAction(actions.importAccount.success, (state, action) => ({
        ...state,
        extensionStatus: 'success',
        accountList: action.payload,
    }))
    .handleAction(actions.selectAccount.success, (state, action) => ({
        ...state,
        account: action.payload,
        accountStatus: 'success',
    }))
    .handleAction([actions.importAccount.failure, actions.selectAccount.failure], (state, action) => {
        const newState = { ...state, error: action.payload };

        if (action.payload === 'no extends found') {
            newState['extensionStatus'] = 'failure';
        }
        if (action.payload === 'no accounts found') {
            newState['accountStatus'] = 'failure';
        }
        if (action.payload === 'set singer failure') {
            newState['accountStatus'] = 'failure';
        }

        return newState;
    })
    .handleAction(actions.fetchVaults.success, (state, action) => ({
        ...state,
        vaults: action.payload,
    }));
