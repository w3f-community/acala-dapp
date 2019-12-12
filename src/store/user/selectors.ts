import { Selector } from '@/types/store';
import { BalanceData, UserVaultData } from '../types';

export const balancesSelector: Selector<BalanceData[]> = state => state.user.balancas;

export const specBalanceSelector: (asset: number) => Selector<number> = asset => {
    return state => {
        const balances = state.user.balancas;
        const result = balances.filter(item => item.asset === asset);

        return result.length ? result[0].balance : 0;
    };
};

// add user prefix for avoid conflict
export const userVaultsSelector: Selector<UserVaultData[]> = state => state.user.vaults;

export const specUserVaultSelector: (asset: number) => Selector<UserVaultData | null> = asset => {
    return state => {
        const vault = state.user.vaults;
        const result = vault.filter(item => item.asset === asset);

        return result.length ? result[0] : null;
    };
};
