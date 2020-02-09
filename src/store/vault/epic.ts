import { Epic } from 'redux-observable';
import {
    filter,
    switchMap,
    withLatestFrom,
    catchError,
    flatMap,
    takeUntil,
    map,
    startWith,
    endWith,
} from 'rxjs/operators';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';
import { of, concat, combineLatest, forkJoin } from 'rxjs';
import { Tx } from '@/types/store';
import { txLog$, txResultFilter$ } from '@/utils/epic';
import * as actions from './actions';
import * as appActions from '../app/actions';
import { startLoading, endLoading } from '../loading/reducer';
import FixedU128 from '@/utils/fixed_u128';
import { u8aToNumber } from '@/utils';

export const createValutEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.updateVault.request)),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const data = action.payload;
            const app = state.chain.app!;
            const address = state.account.account!.address;

            const tx = app.tx.honzon.updateVault(
                data.asset,
                data.collateral.innerToString(),
                data.debit.innerToString(),
            );
            const hash = tx.hash.toString();
            const txRecord: Tx = {
                signer: address,
                hash: hash,
                status: 'pending',
                time: new Date().getTime(),
                type: 'updateVault',
                data: data,
            };
            console.log(data.asset, data.collateral.innerToString(), data.debit.innerToString());

            return concat(
                of(startLoading(actions.UPDATE_VAULT)),
                of(appActions.updateTransition(txRecord)),
                tx.signAndSend(address).pipe(
                    txLog$,
                    txResultFilter$,
                    flatMap(result =>
                        of(
                            appActions.updateTransition({
                                ...txRecord,
                                time: new Date().getTime(),
                                status: 'success',
                            }),
                            actions.updateVault.success(result),
                        ),
                    ),
                    catchError((error: Error) =>
                        of(
                            appActions.updateTransition({
                                ...txRecord,
                                time: new Date().getTime(),
                                status: 'failure',
                            }),
                            actions.updateVault.failure(error.message),
                        ),
                    ),
                    takeUntil(action$.ofType(actions.updateVault.success, actions.updateVault.failure)),
                ),
                of(endLoading(actions.UPDATE_VAULT)),
            );
        }),
    );

export const fetchVaultsEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchVaults.request)),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const app = state.chain.app!;
            const account = state.account.account!;
            const assetList = action.payload;
            console.log(app.query)
            return combineLatest(
                assetList.map(asset =>
                    combineLatest([
                        app.query.loans.collaterals(account.address, asset),
                        app.query.loans.debits(account.address, asset),
                    ]),
                ),
            ).pipe(
                map(result =>
                    assetList.map((asset, index) => ({
                        asset: asset,
                        collateral: FixedU128.fromParts(u8aToNumber(result[index][0])),
                        debit: FixedU128.fromParts(u8aToNumber(result[index][1])),
                    })),
                ),
                flatMap(result => of(actions.fetchVaults.success(result), endLoading(actions.FETCH_VAULTS))),
                startWith(startLoading(actions.FETCH_VAULTS)),
                catchError(() => of(actions.fetchVaults.failure('error'))),
            );
        }),
    );
