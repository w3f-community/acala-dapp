import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { AppState } from '@/types/store';
import FixedU128 from '@/utils/fixed_u128';

const initialState: AppState = {
    transactions: [],
    txRecord: [],
};

const STORAGE_KEY = 'tx-storage-v0.0.1';

export default createReducer(initialState)
    .handleAction(actions.updateTransition, (state, action) => {
        const data = action.payload;
        const transactions = state.transactions.slice();
        const result = transactions.find(item => item.id === data.id);

        if (result) {
            Object.assign(result, data);
        } else {
            transactions.push(data);
        }

        const record = state.txRecord.slice();
        const recordResult = record.find(item => item.id === data.id);
        if (result) {
            Object.assign(recordResult, {
                time: data.time,
                status: data.status,
            });
        } else {
            record.push(data);
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
        return Object.assign({}, state, { transactions, txRecord: record });
    })
    .handleAction(actions.loadTxRecord, state => {
        const storageData = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
        storageData &&
            storageData.forEach((item: any) => {
                // convert FixedU128
                Object.keys(item.data).forEach((key: any) => {
                    if (item.data[key].inner) {
                        item.data[key] = FixedU128.fromParts(item.data[key].inner);
                    }
                })
            });
        if (storageData) {
            return { ...state, txRecord: storageData };
        }
        return state;
    })
    .handleAction(actions.removeTransition, (state, action) => {
        const id = action.payload;
        const transactions = state.transactions.slice();
        const index = transactions.findIndex(item => item.id === id);

        if (index !== -1) {
            transactions.splice(index, 1);
        }

        return {
            ...state,
            transactions,
        };
    });
