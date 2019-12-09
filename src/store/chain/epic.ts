import { WsProvider, ApiRx } from '@polkadot/api';
import { Epic } from 'redux-observable';
import { filter, map, switchMap, startWith, endWith, withLatestFrom } from 'rxjs/operators';
import { combineLatest, interval } from 'rxjs';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';

import { startLoading, endLoading } from '../loading/reducer';
import * as actions from './actions';

export const connectEpic: Epic<RootAction, RootAction, RootState> = action$ =>
    action$.pipe(
        filter(isActionOf(actions.connectAsync.request)),
        switchMap(({ payload }) => {
            const { endpoint, types } = payload;
            // TODO: need fixed
            Object.assign(types, {
                TimestampedValue: {
                    value: 'OracleValue',
                    timestamp: 'Moment',
                },
                TimestampedValueOf: 'TimestampedValue',
            });
            const wsProvider = new WsProvider(endpoint);
            return ApiRx.create({ provider: wsProvider, types: types }).pipe(
                map(actions.connectAsync.success),
                startWith(startLoading(actions.CONNECT_ASYNC)),
                endWith(endLoading(actions.CONNECT_ASYNC)),
            );
        }),
    );

export const fetchPricesFeedEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchPricesFeed.request)),
        switchMap(action =>
            interval(1000 * 60).pipe(
                startWith(0),
                withLatestFrom(state$),
                filter(([_, state]) => state.chain.app !== null), // ensure has app entity,
                switchMap(([_, state]) => {
                    const payload = action.payload as actions.FetchPricesFeedParams;
                    const app = state.chain.app;
                    return combineLatest<Array<any>>(payload.data.map(asset => app!.query.oracle.values(asset))).pipe(
                        map(result =>
                            payload.data.map((asset, index) => ({
                                asset,
                                price: Number(result[index].toString()),
                            })),
                        ),
                        map(actions.fetchPricesFeed.success),
                    );
                }),
            ),
        ),
    );
