import { Epic } from 'redux-observable';
import { filter, map, switchMap, withLatestFrom, startWith, merge, flatMap, take } from 'rxjs/operators';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';

import * as actions from './actions';
import * as appActions from '../app/actions';
import { of, concat } from 'rxjs';

export const createValutEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.updateVault.request)),
        withLatestFrom(state$),
        filter(([_, state]) => state.chain.app !== null),
        filter(([_, state]) => state.user.account !== null),
        switchMap(([action, state]) => {
            const data = action.payload;
            const app = state.chain.app!;
            const address = state.user.account.address;
            const tx = app.tx.honzon.updateVault(data.asset, data.collateral, data.debit);
            const hash = tx.hash.toString();
            return concat(
                of(
                    appActions.updateTxRecord({
                        hash: hash,
                        status: 'pending',
                        time: new Date().getTime(),
                        type: 'updateVault',
                        data: data,
                    }),
                ),
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
                    map(actions.updateVault.success),
                    take(1),
                ),
                of(
                    appActions.updateTxRecord({
                        hash: hash,
                        status: 'success',
                        time: new Date().getTime(),
                        type: 'updateVault',
                        data: data,
                    }),
                ),
            );
        }),
    );
