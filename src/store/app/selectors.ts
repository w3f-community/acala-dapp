import { RootState } from 'typesafe-actions';
import { Tx } from '../types';

export function txRecordSelector(state: RootState): Tx[] {
    return state.app.txRecord;
}
