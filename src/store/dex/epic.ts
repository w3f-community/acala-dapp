import { Epic } from 'redux-observable';
import { filter, map, switchMap, withLatestFrom, catchError, flatMap, takeUntil } from 'rxjs/operators';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';
import * as actions from './actions';
import { concat, combineLatest, of } from 'rxjs';
import FixedU128 from '@/utils/fixed_u128';
import { u8aToNumber } from '@/utils';
import { startLoading, endLoading } from '../loading/reducer';
import * as appActions from '../app/actions';
import { Tx } from '@/types/store';
import { txLog$, txResultHandler$ } from '@/utils/epic';

export const createValutEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.swapCurrency.request)),
        withLatestFrom(state$),
        filter(([_, state]) => state.chain.app !== null),
        filter(([_, state]) => state.account.account !== null),
        switchMap(([action, state]) => {
            const data = action.payload;
            const app = state.chain.app!;
            const address = state.account.account!.address;
            const tx = app.tx.dex.swapCurrency(
                [data.supply.asset, data.supply.balance.innerToString()],
                [data.target.asset, data.target.balance.innerToString()],
            );
            const hash = tx.hash.toString();
            const txRecord: Tx = {
                signer: address,
                hash: hash,
                status: 'pending',
                time: new Date().getTime(),
                type: 'swapCurrency',
                data: data,
            };

            return concat(
                of(startLoading(actions.SWAP_CURRENCY)),
                of(appActions.updateTransition(txRecord)),
                tx.signAndSend(address).pipe(
                    txLog$,
                    txResultHandler$,
                    flatMap(result =>
                        of(
                            appActions.updateTransition({ ...txRecord, time: new Date().getTime(), status: 'success' }),
                            actions.swapCurrency.success(result),
                        ),
                    ),
                    catchError((error: Error) =>
                        of(
                            appActions.updateTransition({ ...txRecord, time: new Date().getTime(), status: 'failure' }),
                            actions.swapCurrency.failure(error.message),
                        ),
                    ),
                    takeUntil(action$.ofType(actions.swapCurrency.success, actions.swapCurrency.failure)),
                ),
                of(endLoading(actions.SWAP_CURRENCY)),
            );
        }),
    );

export const fetchDexLiquidityPool: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchDexLiquidityPool.request)),
        withLatestFrom(state$),
        filter(([_, state]) => state.chain.app !== null), // ensure has app entity,
        switchMap(([action, state]) => {
            const assetList = action.payload;
            const app = state.chain.app;
            return combineLatest(assetList.map(asset => app!.query.dex.liquidityPool(asset))).pipe(
                map((result: Array<any>) => {
                    return assetList.map((asset, index) => {
                        return {
                            asset,
                            pool: {
                                other: FixedU128.fromParts(u8aToNumber(result[index][0])),
                                base: FixedU128.fromParts(u8aToNumber(result[index][1])),
                            },
                        };
                    });
                }),
                map(actions.fetchDexLiquidityPool.success),
            );
        }),
    );
