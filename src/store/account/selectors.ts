import { Selector, BalanceData, Account, AccountError, Status, AccountState } from '@/types/store';
import FixedU128 from '@/utils/fixed_u128';
import { RootState } from 'typesafe-actions';

export const balancesSelector: Selector<BalanceData[]> = state => state.account.balancas;

// export const specBalanceSelector: (asset: number) => Selector<FixedU128> = asset => {
//     return state => {
//         const balances = state.account.balancas;
//         const result = balances.find(item => item.asset === asset);

//         return result ? result.balance : FixedU128.fromNatural(0);
//     };
// };
export function specBalanceSelector(assets: number): Selector<FixedU128>;
export function specBalanceSelector(assets: number[]): Selector<FixedU128[]>;
export function specBalanceSelector(assets: number | number[]): Selector<FixedU128> | Selector<FixedU128[]> {
    if (typeof assets === 'number') {
        return state => {
            const balances = state.account.balancas;
            const result = balances.find(item => item.asset === assets);
            return result ? result.balance : FixedU128.fromNatural(0);
        };
    }
    return state => {
        const balances = state.account.balancas;
        return assets.map(asset => {
            const result = balances.find(item => item.asset === asset);
            return result ? result.balance : FixedU128.fromNatural(0);
        });
    };
}

type AccountStateType = keyof AccountState;
export function accountStoreSelector<Key extends AccountStateType>(keys: Key[]) {
    return (state: RootState) => keys.map(key => state.account[key]);
}

export const accountListSelector: Selector<Account[]> = state => state.account.accountList;

export const accountSelector: Selector<Account | null> = state => state.account.account;

export const extensionStatusSelector: Selector<Status> = state => state.account.extensionStatus;

export const accountStatusSelector: Selector<Status> = state => state.account.accountStatus;

export const accountErrorSelector: Selector<AccountError> = state => state.account.error;
