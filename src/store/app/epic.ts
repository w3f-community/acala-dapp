import { WsProvider, ApiRx } from '@polkadot/api';
import { get } from 'lodash';
import { Epic } from 'redux-observable';
import { filter, map, switchMap, startWith, endWith, withLatestFrom } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';

import { u8aToNumber } from '@/utils';
import { startLoading, endLoading } from '../loading/reducer';
import * as actions from './actions';
import FixedU128 from '@/utils/fixed_u128';

// export const connectEpic: Epic<RootAction, RootAction, RootState> = action$ =>
//     action$.pipe(
//         filter(isActionOf(actions.fetchTxRecordAsync.request)),
//         switchMap(() => {
//             const db = window.indexedDB.open('acala_tx_db', 1);
//             return of(db).pipe(
//                 map(actions.fetchTxRecordAsync.success)
//             )
//         }),
//     );
