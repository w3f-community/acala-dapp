import { createReducer } from 'typesafe-actions';
import { TxStatus, Tx } from '../types';
import * as actions from './actions';
import * as appActions from '../app/actions';

export interface VaultState {
    updateVaultStatus: TxStatus;
    txRecord: Tx[];
    [T: string]: any;
}

const initialState: VaultState = {
    updateVaultStatus: 'none',
    txRecord: [],
};

const STORAGE_KEY = 'vault-tx-storage';

export default createReducer(initialState)
    .handleAction(actions.updateVault.request, state => ({
        ...state,
        updateVaultStatus: 'pending',
    }))
    .handleAction(actions.updateVault.success, state => ({
        ...state,
        updateVaultStatus: 'success',
    }))
    .handleAction(actions.reset, state => ({
        ...state,
        updateVaultStatus: 'none',
    }))
    .handleAction(appActions.updateTransition, (state, action) => {
        const record = state.txRecord.slice();
        const data = action.payload;

        if (data.type !== 'updateVault') {
            return state;
        }

        const result = record.find(item => item.hash === data.hash);

        if (result) {
            Object.assign(result, {
                time: data.time,
                status: data.status,
            });
        } else {
            record.push(data);
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));

        return { ...state, txRecord: record };
    })
    .handleAction(actions.loadTxRecord, state => {
        const storageData = window.localStorage.getItem(STORAGE_KEY);

        if (storageData) {
            return { ...state, txRecord: JSON.parse(storageData) };
        }
        return state;
    });
