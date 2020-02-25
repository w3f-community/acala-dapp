import { createAction } from 'typesafe-actions';
import { Tx } from '@/types/store';

export const UPDATE_TRANSITION = '@app/update_transaction';
export const updateTransition = createAction(UPDATE_TRANSITION, action => {
    return (tx: Tx) => action(tx);
});

export const REMOVE_TRANSITION = '@/app/remove_transaction';
export const removeTransition = createAction(REMOVE_TRANSITION, action => {
    return (hash: string) => action(hash);
});

export const LOAD_TX_RECORD = '@loan/load_tx_record';
export const loadTxRecord = createAction(LOAD_TX_RECORD);
