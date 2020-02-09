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
    take,
} from 'rxjs/operators';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';
import { of, concat, combineLatest, forkJoin, Observable, ObservableInput } from 'rxjs';
import { Tx, ProposalData } from '@/types/store';
import { txLog$, txResultFilter$ } from '@/utils/epic';
import * as actions from './actions';
import * as appActions from '../app/actions';
import { startLoading, endLoading } from '../loading/reducer';
import FixedU128 from '@/utils/fixed_u128';
import { u8aToNumber } from '@/utils';
import { Hash, Proposal, Votes } from '@polkadot/types/interfaces';
import { Option } from '@polkadot/types';
import { stringToU8a } from '@polkadot/util';
import { Codec } from '@polkadot/types/types';

interface ProposalResult {
    callIndex: string;
    args: { [k: string]: any };
}

type Result = [Hash[], Option<Proposal>[], Option<Votes>[]];

export const fetchProposals: Epic<RootAction, RootAction, RootState> = (action$: any, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchProposals.request)),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const app = state.chain.app!;
            return app.query.financialCouncil.proposals().pipe(
                switchMap((hashes: Hash[]): any => {
                    /* eslint-disable */
                    return hashes.length
                        ? combineLatest([
                            of(hashes),
                            app.query.financialCouncil.proposalOf.multi(hashes),
                            app.query.financialCouncil.voting.multi(hashes),
                        ])
                        : of([[], [], []]);
                    /* eslint-enable */
                }),
                map((result: Result) => {
                    const hashes = result[0].map(item => item.toString());
                    const proposals = result[1].map(item => {
                        const callIndex = (item.value as { [k: string]: any }).callIndex;
                        const data = (item.toJSON() as any) as ProposalResult;
                        return {
                            method: item.registry.findMetaCall(callIndex).toJSON(),
                            ...data,
                        };
                    });
                    const votes = result[2].map(item => item.toJSON());
                    return hashes.map((hash, index) => ({
                        hash,
                        proposal: proposals[index],
                        vote: votes[index],
                    }));
                }),
                map(actions.fetchProposals.success),
            );
        }),
    );

export const fetchCouncil: Epic<RootAction, RootAction, RootState> = (action$: any, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchCouncil.request)),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const app = state.chain.app!;
            return app.query.financialCouncil.members().pipe(
                map((result: Codec) => result.toJSON()),
                map(actions.fetchCouncil.success),
            );
        }),
    );
