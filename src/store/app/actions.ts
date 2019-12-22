import { createAction } from 'typesafe-actions';
import { Tx } from '../types';

export const UPDATE_TRANSITION = '@app/update_transition';
export const updateTransition = createAction(UPDATE_TRANSITION, action => {
    return (tx: Tx) => action(tx);
});

export const REMOVE_TRANSITION = '@/app/remove_transition';
export const removeTransition = createAction(REMOVE_TRANSITION, action => {
    return (hash: string) => action(hash);
});
