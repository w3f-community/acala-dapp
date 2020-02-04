import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import * as appActions from '../app/actions';
import FixedU128 from '@/utils/fixed_u128';
import { VaultState } from '@/types/store';

const initialState: VaultState = {
    updateVaultStatus: 'none',
    txRecord: [],
    vaults: [],
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
    .handleAction(actions.updateVault.failure, state => ({
        ...state,
        updateVaultStatus: 'none',
    }))
    .handleAction(actions.reset, state => ({
        ...state,
        updateVaultStatus: 'none',
    }))
    .handleAction(appActions.updateTransition, (state, action) => {
        const record = state.txRecord.slice();
        const data = action.payload;

        if (data.type !== 'updateVault' || data.status !== 'success') {
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
        const storageData = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
        // for FixedU128
        storageData &&
            storageData.forEach((item: { data: { collateral: any; debit: any } }) => {
                item.data.collateral = FixedU128.fromParts(item.data.collateral.inner);
                item.data.debit = FixedU128.fromParts(item.data.debit.inner);
            });
        if (storageData) {
            return { ...state, txRecord: storageData };
        }
        return state;
    })
    .handleAction(actions.fetchVaults.success, (state, action) => ({
        ...state,
        vaults: action.payload,
    }));
