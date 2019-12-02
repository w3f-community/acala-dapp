import { WsProvider, ApiRx } from '@polkadot/api';
import { Epic } from 'redux-observable';
import { filter, map, switchMap, startWith, endWith } from 'rxjs/operators';
import { startLoading, endLoading } from '../loading/reducer';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';
import * as actions from './actions';

export const connectEpic: Epic<RootAction, RootAction, RootState> = (action$: any) => action$.pipe(
    filter(isActionOf(actions.connectAsync.request)),
    switchMap((action: RootAction) => {
        const { endpoint, types } = action.payload;
        const wsProvider = new WsProvider(endpoint);
        return ApiRx.create({ provider: wsProvider, types: types }).pipe(
            map(actions.connectAsync.success),
            startWith(startLoading(actions.CONNECT_ASYNC)),
            endWith(endLoading(actions.CONNECT_ASYNC))
        );
    })
);