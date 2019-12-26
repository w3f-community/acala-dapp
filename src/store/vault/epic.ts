import { Epic } from 'redux-observable';
import { filter, switchMap, withLatestFrom, catchError, flatMap, takeUntil } from 'rxjs/operators';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';
import { of, concat } from 'rxjs';
import { Tx } from '@/types/store';
import { txLog$, txResultHandler$ } from '@/utils/epic';
import * as actions from './actions';
import * as appActions from '../app/actions';
import { startLoading, endLoading } from '../loading/reducer';

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

            return concat(
                of(startLoading(actions.UPDATE_VAULT)),
                of(appActions.updateTransition(txRecord)),
                tx.signAndSend(address).pipe(
                    txLog$,
                    txResultHandler$,
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
