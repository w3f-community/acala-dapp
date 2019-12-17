import { createReducer } from 'typesafe-actions';
import { findIndex } from 'lodash';
import { AppState } from '../types';
import * as actions from './actions';

const initialState: AppState = {
    txRecord: [],
};

const LOCAL_STORAGE_KEY = 'acala_tx_record';

export default createReducer(initialState)
    .handleAction(actions.updateTxRecord, (state, action) => {
        const data = action.payload;
        const txRecord = state.txRecord.slice();
        const result = txRecord.find(item => item.hash === data.hash);
        if (result) {
            Object.assign(result, data);
        } else {
            txRecord.push(data);
        }
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(txRecord));
        return Object.assign({}, state, { txRecord });
    })
    .handleAction(actions.fetchTxRecord, state => {
        let txRecord = [];
        const value = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (value) {
            txRecord = JSON.parse(value);
        }
        console.log('??', txRecord);
        return { ...state, txRecord };
    });
