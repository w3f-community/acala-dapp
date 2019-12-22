import { Epic } from 'redux-observable';
import { filter, map, switchMap, withLatestFrom, take, catchError } from 'rxjs/operators';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';
import * as actions from './actions';
import { concat, combineLatest, of } from 'rxjs';
import FixedU128 from '@/utils/fixed_u128';
import { u8aToNumber } from '@/utils';
import { startLoading, endLoading } from '../loading/reducer';
import * as appActions from '../app/actions';
import { Tx } from '../types';

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
                    map(result => {
                        console.log('finally? ', result.isFinalized);
                        // Loop through Vec<EventRecord> to display all events
                        result.events.forEach(({ phase, event: { data, method, section } }: any) => {
                            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
                        });
                        return result;
                    }),
                    filter((result: any) => result.isFinalized),
                    map(actions.swapCurrency.success),
                    catchError((error: Error) => {
                        return of(actions.swapCurrency.failure(error.message));
                    }),
                    take(1),
                ),
                of(endLoading(actions.SWAP_CURRENCY)),
                of(appActions.updateTransition({ ...txRecord, time: new Date().getTime(), status: 'success' })),
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
                            pool: [
                                FixedU128.fromParts(u8aToNumber(result[index][0])),
                                FixedU128.fromParts(u8aToNumber(result[index][1])),
                            ],
                        };
                    });
                }),
                map(actions.fetchDexLiquidityPool.success),
            );
        }),
    );
