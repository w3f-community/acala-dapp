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
                Price: 'FixedU128',
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
        withLatestFrom(state$),
        filter(([action, state]) => state.chain.app !== null), // ensure has app entity,
        switchMap(([action, state]) => {
            const assetList = action.payload;
            const app = state.chain.app;
            return combineLatest(assetList.map(asset => app!.query.oracle.values(asset))).pipe(
                map(result =>
                    assetList.map((asset, index) => {
                        const price = get(result, [index, 'value', 'value'], { isNone: true });
                        return {
                            asset,
                            price: FixedU128.fromParts(u8aToNumber(price)),
                        };
                    }),
                ),
                map(actions.fetchPricesFeed.success),
            );
        }),
    );

export const fetchVaultsEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchVaults.request)),
        withLatestFrom(state$),
        filter(([_, state]) => state.chain.app !== null),
        switchMap(([action, state]) => {
            const assetList = action.payload;
            const app = state.chain.app;
            return combineLatest(
                assetList.map(asset =>
                    combineLatest([
                        app!.query.cdpEngine.debitExchangeRate(asset),
                        app!.query.cdpEngine.liquidationPenalty(asset),
                        app!.query.cdpEngine.liquidationRatio(asset),
                        app!.query.cdpEngine.maximumTotalDebitValue(asset),
                        app!.query.cdpEngine.requiredCollateralRatio(asset),
                        app!.query.cdpEngine.stabilityFee(asset),
                    ]),
                ),
            ).pipe(
                map(result => {
                    return assetList.map((asset, index) => ({
                        asset,
                        debitExchangeRate: FixedU128.fromParts(u8aToNumber(result[index][0])),
                        liquidationPenalty: FixedU128.fromParts(u8aToNumber(result[index][1])),
                        liquidationRatio: FixedU128.fromParts(u8aToNumber(result[index][2])),
                        maximumTotalDebitValue: FixedU128.fromParts(u8aToNumber(result[index][3])),
                        requiredCollateralRatio: FixedU128.fromParts(u8aToNumber(result[index][4])),
                        stabilityFee: FixedU128.fromParts(u8aToNumber(result[index][5])),
                    }));
                }),
                map(actions.fetchVaults.success),
            );
        }),
    );

export const fetchTotalIssuance: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchTotalIssuance.request)),
        withLatestFrom(state$),
        filter(([action, state]) => state.chain.app !== null), // ensure has app entity,
        switchMap(([action, state]) => {
            const assetList = action.payload;
            const app = state.chain.app;
            return combineLatest(assetList.map(asset => app!.query.tokens.totalIssuance(asset))).pipe(
                map(result =>
                    assetList.map((asset, index) => {
                        return {
                            asset,
                            issuance: FixedU128.fromParts(u8aToNumber(result[index])),
                        };
                    }),
                ),
                map(actions.fetchTotalIssuance.success),
            );
        }),
    );
