import { createAsyncAction, createAction } from 'typesafe-actions';
import { RegistryTypes } from '@polkadot/types/types';
import { ApiRx } from '@polkadot/api';
import { Tx } from '../types';

export const UPDATE_TX_RECORD = '@app/update_tx_record';
export const updateTxRecord = createAction(UPDATE_TX_RECORD, action => {
    return (tx: Tx) => action(tx);
});

export const FETCH_TX_RECORD = '@app/fetch_tx_record';
export const fetchTxRecord = createAction(FETCH_TX_RECORD);
