import { Epic } from 'redux-observable';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';

import * as actions from './actions';

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
            return tx.signAndSend(address).pipe(
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
            );
        }),
    );
