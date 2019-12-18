import { Selector } from '@/types/store';
import { BalanceData, UserVaultData, Account } from '../types';
import FixedU128 from '@/utils/fixed_u128';

export const balancesSelector: Selector<BalanceData[]> = state => state.user.balancas;

export const specBalanceSelector: (asset: number) => Selector<FixedU128> = asset => {
    return state => {
        const balances = state.user.balancas;
        const result = balances.filter(item => item.asset === asset);

        return result.length ? result[0].balance : FixedU128.fromNatural(0);
    };
};

// add user prefix for avoid conflict
export const userVaultsSelector: Selector<UserVaultData[]> = state => {
    const vaults = state.user.vaults;

    // filter empty vault
    return vaults.filter(item => {
        return !item.collateral.isZero() || !item.debit.isZero();
    })
}

export const specUserVaultSelector: (asset: number) => Selector<UserVaultData | null> = asset => {
    return state => {
        const vault = state.user.vaults;
        const result = vault.filter(item => item.asset === asset);

        return result.length ? result[0] : null;
    };
};

export const accountSelector: Selector<Account> = state => state.user.account;
