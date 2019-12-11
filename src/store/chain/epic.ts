import { WsProvider, ApiRx } from '@polkadot/api';
import { Epic } from 'redux-observable';
import { filter, map, switchMap, startWith, endWith, withLatestFrom } from 'rxjs/operators';
import { combineLatest, interval } from 'rxjs';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';

import { u8aToNumber } from '@/utils';
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
                FixedU128: 'u128',
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

export const fetchVaultsEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchVaults.request)),
        switchMap(action =>
            interval(1000 * 60).pipe(
                startWith(0),
                withLatestFrom(state$),
                filter(([_, state]) => state.chain.app !== null),
                switchMap(([_, state]) => {
                    const payload = action.payload as actions.FetchVaultsParams;
                    const app = state.chain.app;
                    return combineLatest([
                        combineLatest(payload.data.map(asset => app!.query.cdpEngine.debitExchangeRate(asset))),
                        combineLatest(payload.data.map(asset => app!.query.cdpEngine.liquidationPenalty(asset))),
                        combineLatest(payload.data.map(asset => app!.query.cdpEngine.liquidationRatio(asset))),
                        combineLatest(payload.data.map(asset => app!.query.cdpEngine.maximumTotalDebitValue(asset))),
                        combineLatest(payload.data.map(asset => app!.query.cdpEngine.requiredCollateralRatio(asset))),
                        combineLatest(payload.data.map(asset => app!.query.cdpEngine.stabilityFee(asset))),
                    ]).pipe(
                        map(result => {
                            return payload.data.map((asset, index) => ({
                                asset,
                                debitExchangeRate: u8aToNumber(result[0][index]),
                                liquidationPenalty: u8aToNumber(result[1][index]),
                                liquidationRatio: u8aToNumber(result[2][index]),
                                maximumTotalDebitValue: u8aToNumber(result[3][index]),
                                requiredCollateralRatio: u8aToNumber(result[4][index]),
                                stabilityFee: u8aToNumber(result[5][index]),
                            }));
                        }),
                        map(actions.fetchVaults.success),
                    );
                }),
            ),
        ),
    );
