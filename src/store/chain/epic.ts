import { WsProvider, ApiRx } from '@polkadot/api';
import { get } from 'lodash';
import { Epic } from 'redux-observable';
import { filter, map, switchMap, withLatestFrom, take, first, exhaustMap, mergeMap } from 'rxjs/operators';
import { combineLatest, concat, of, empty } from 'rxjs';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';
import { types as acalaTypes } from '@acala-network/types';
import ormlRPC from '@orml/jsonrpc';

import { u8aToNumber } from '@/utils';
import { startLoading, endLoading } from '../loading/reducer';
import * as actions from './actions';
import FixedU128 from '@/utils/fixed_u128';

export const connectEpic: Epic<RootAction, RootAction, RootState> = action$ =>
    action$.pipe(
        filter(isActionOf(actions.connectAsync.request)),
        switchMap(({ payload }) => {
            const { endpoint } = payload;
            const wsProvider = new WsProvider(endpoint);
            // FIXME: use a concrete type once polkadotjs fixes inconsistency.
            const rpc: any = { oracle: Object.values(ormlRPC.oracle.methods) };

            return concat(
                of(startLoading(actions.CONNECT_ASYNC)),
                ApiRx.create({ provider: wsProvider, types: acalaTypes as any, rpc }).pipe(map(actions.connectAsync.success), take(1)),
                of(endLoading(actions.CONNECT_ASYNC)),
            );
        }),
    );

export const fetchPricesFeedEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchPricesFeed.request)),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const assetList = action.payload;
            const app = state.chain.app!;
            // FIXME: use a concrete type once polkadotjs fixes inconsistency.
            return combineLatest(assetList.map(asset => (app.rpc as any).oracle.getValue(asset))).pipe(
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

export const fetchCdpTypesEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchCdpTypes.request)),
        withLatestFrom(state$),
        exhaustMap(params => {
            const [action, state] = params;
            return state.chain.constants
                ? of([action, state] as typeof params)
                /* eslint-disable */
                : state$.pipe(
                    mergeMap(state => {
                        return state.chain.constants ? of([action, state] as typeof params) : empty();
                    }),
                    first(),
                );
            /* eslint-enable */
        }),
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
                        debitExchangeRate: result[index][0].isEmpty
                            ? state.chain.constants!.cdpEngine.defaultDebitExchangeRate
                            : FixedU128.fromParts(u8aToNumber(result[index][0])),
                        liquidationPenalty: FixedU128.fromParts(u8aToNumber(result[index][1])),
                        liquidationRatio: FixedU128.fromParts(u8aToNumber(result[index][2])),
                        maximumTotalDebitValue: FixedU128.fromParts(u8aToNumber(result[index][3])),
                        requiredCollateralRatio: FixedU128.fromParts(u8aToNumber(result[index][4])),
                        stabilityFee: FixedU128.fromParts(u8aToNumber(result[index][5])),
                    }));
                }),
                map(actions.fetchCdpTypes.success),
            );
        }),
    );

export const fetchTotalIssuance: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchTotalIssuance.request)),
        withLatestFrom(state$),
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

export const fetchConstants: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchConstants.request)),
        withLatestFrom(state$),
        map(([action, state]) => {
            const app = state.chain.app!;
            return {
                cdpEngine: {
                    collateralCurrencyIds: app.consts.cdpEngine.collateralCurrencyIds,
                    defaultDebitExchangeRate: app.consts.cdpEngine.defaultDebitExchangeRate,
                    defaultLiquidationRatio: app.consts.cdpEngine.defaultLiquidationRatio,
                    stableCurrencyId: app.consts.cdpEngine.getStableCurrencyId,
                    globalStabilityFee: app.consts.cdpEngine.globalStabilityFee,
                    maxSlippageSwapWithDex: app.consts.cdpEngine.maxSlippageSwapWithDex,
                    minimumDebitValue: app.consts.cdpEngine.minimumDebitValue,
                },
            };
        }),
        map(result => {
            const { cdpEngine } = result;
            return {
                cdpEngine: {
                    collateralCurrencyIds: (cdpEngine.collateralCurrencyIds.toJSON() as any) as string[],
                    defaultDebitExchangeRate: FixedU128.fromParts(cdpEngine.defaultLiquidationRatio.toString()),
                    defaultLiquidationRatio: FixedU128.fromParts(cdpEngine.defaultLiquidationRatio.toString()),
                    stableCurrencyId: cdpEngine.stableCurrencyId.toString(),
                    globalStabilityFee: FixedU128.fromParts(cdpEngine.globalStabilityFee.toString()),
                    maxSlippageSwapWithDex: FixedU128.fromParts(cdpEngine.maxSlippageSwapWithDex.toString()),
                    minimumDebitValue: FixedU128.fromParts(cdpEngine.minimumDebitValue.toString()),
                },
            };
        }),
        map(result => actions.fetchConstants.success(result)),
    );
