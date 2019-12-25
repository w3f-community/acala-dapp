import { Epic } from 'redux-observable';
import { filter, map, delay } from 'rxjs/operators';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';

import * as actions from './actions';

export const autoRemoveTransitionEpic: Epic<RootAction, RootAction, RootState> = action$ =>
    action$.pipe(
        filter(isActionOf(actions.updateTransition)),
        filter(({ payload }) => {
            return payload.status === 'success' || payload.status === 'failure';
        }),
        delay(2000),
        map(({ payload }) => actions.removeTransition(payload.hash)),
    );
