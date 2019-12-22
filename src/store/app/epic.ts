import { WsProvider, ApiRx } from '@polkadot/api';
import { Epic } from 'redux-observable';
import { filter, mergeMap, timeout, map, timeoutWith, concatMap, delay } from 'rxjs/operators';
import { of, concat } from 'rxjs';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';

import * as actions from './actions';
import { Tx } from '../types';

export const autoRemoveTransitionEpic: Epic<RootAction, RootAction, RootState> = action$ =>
    action$.pipe(
        filter(isActionOf(actions.updateTransition)),
        filter(({ payload }) => {
            return payload.status === 'success' || payload.status === 'failure';
        }),
        delay(2000),
        map(({ payload }) => actions.removeTransition(payload.hash)),
    );
