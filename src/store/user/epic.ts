import { Epic } from 'redux-observable';
import { filter, map, switchMap, startWith, withLatestFrom, endWith } from 'rxjs/operators';
import { combineLatest, interval, defer } from 'rxjs';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';

import * as actions from './actions';
import { AssetList } from '../types';
import { u8aToNumber } from '@/utils';
import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { startLoading, endLoading } from '../loading/reducer';

export const fetchAssetBalanceEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchAssetsBalance.request)),
        switchMap(action =>
            interval(1000 * 60).pipe(
                startWith(0),
                withLatestFrom(state$),
                filter(([_, state]) => state.chain.app !== null),
                filter(([_, state]) => state.user.account !== null),
                switchMap(([_, state]) => {
                    const data = action.payload as AssetList;
                    const app = state.chain.app;
                    const account = state.user.account!.address;
                    return combineLatest(data.map(asset => app!.query.tokens.balance(asset, account))).pipe(
                        map(result => {
                            return data.map((asset, index) => ({
                                asset,
                                balance: u8aToNumber(result[index]),
                            }));
                        }),
                        map(actions.fetchAssetsBalance.success),
                    );
                }),
            ),
        ),
    );

export const importAccmountEpic: Epic<RootAction, RootAction, RootState> = action$ =>
    action$.pipe(
        filter(isActionOf(actions.importAccount.request)),
        switchMap(action =>
            defer(async () => {
                // wait for the promise to resolve, async WASM
                await cryptoWaitReady();
                const keyring = new Keyring({ type: 'sr25519' });
                return keyring.addFromUri(action.payload);
            }),
        ),
        map(actions.importAccount.success),
    );

export const fetchVaultsEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchVaults.request)),
        switchMap(action =>
            interval(60 * 1000).pipe(
                startWith(0),
                withLatestFrom(state$),
                filter(([_, state]) => state.chain.app !== null),
                filter(([_, state]) => state.user.account !== null),
                switchMap(([_, state]) => {
                    const app = state.chain.app!;
                    const account = state.user.account!;
                    const assetList = action.payload;
                    return combineLatest(
                        assetList.map(asset =>
                            combineLatest([
                                app.query.vaults.collaterals(account.address, asset),
                                app.query.vaults.debits(account.address, asset),
                            ]),
                        ),
                    ).pipe(
                        map(result => {
                            return assetList
                                .map((asset, index) => ({
                                    asset: asset,
                                    collateral: u8aToNumber(result[index][0]),
                                    debit: u8aToNumber(result[index][1]),
                                }))
                                .filter(item => {
                                    // filter empty vaults
                                    return item.collateral !== 0 || item.debit !== 0;
                                });
                        }),
                        map(actions.fetchVaults.success),
                        startWith(startLoading(actions.FETCH_VAULTS)),
                        endWith(endLoading(actions.FETCH_VAULTS)),
                    );
                }),
            ),
        ),
    );
