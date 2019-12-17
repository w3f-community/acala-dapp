import { Epic } from 'redux-observable';
import { filter, map, switchMap, startWith, withLatestFrom, endWith } from 'rxjs/operators';
import { combineLatest, defer } from 'rxjs';
import { isActionOf, RootAction, RootState } from 'typesafe-actions';
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';

import * as chainActions from '../chain/actions';
import * as actions from './actions';
import { AssetList } from '../types';
import { u8aToNumber } from '@/utils';
import { startLoading, endLoading } from '../loading/reducer';
import FixedU128 from '@/utils/fixed_u128';

export const fetchAssetBalanceEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchAssetsBalance.request)),
        withLatestFrom(state$),
        filter(([_, state]) => state.chain.app !== null),
        filter(([_, state]) => state.user.account !== null),
        switchMap(([action, state]) => {
            const data = action.payload as AssetList;
            const app = state.chain.app;
            const account = state.user.account!.address;
            return combineLatest(data.map(asset => app!.query.tokens.balance(asset, account))).pipe(
                map(result => {
                    return data.map((asset, index) => ({
                        asset,
                        balance: FixedU128.fromParts(u8aToNumber(result[index])),
                    }));
                }),
                map(actions.fetchAssetsBalance.success),
            );
        }),
    );

export const importAccmountEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.importAccount.request)),
        switchMap(savedAction => {
            return action$.pipe(
                filter(isActionOf(chainActions.connectAsync.success)),
                map(() => savedAction),
            );
        }),
        withLatestFrom(state$),
        switchMap(([action, state]) =>
            defer(async () => {
                const app = state.chain.app!;
                const allInjected = await web3Enable('Acala Honzon Platform');
                const allAccounts = await web3Accounts();
                const injector = await web3FromAddress(allAccounts[0].address);

                // sets the signer for the address on the @polkadot/api
                app.setSigner(injector.signer);
                // wait for the promise to resolve, async WASM
                return { address: allAccounts[0].address };
            }).pipe(
                map(actions.importAccount.success),
                startWith(startLoading(actions.IMPORT_ACCOUNT)),
                endWith(endLoading(actions.IMPORT_ACCOUNT)),
            ),
        ),
    );

export const fetchVaultsEpic: Epic<RootAction, RootAction, RootState> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.fetchVaults.request)),
        withLatestFrom(state$),
        filter(([_, state]) => state.chain.app !== null),
        filter(([_, state]) => state.user.account !== null),
        switchMap(([action, state]) => {
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
                    return assetList.map((asset, index) => ({
                        asset: asset,
                        collateral: FixedU128.fromParts(u8aToNumber(result[index][0])),
                        debit: FixedU128.fromParts(u8aToNumber(result[index][1])),
                    }));
                }),
                map(actions.fetchVaults.success),
            );
        }),
    );
