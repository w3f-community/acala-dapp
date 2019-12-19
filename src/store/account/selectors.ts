import { Selector } from '@/types/store';
import { BalanceData, UserVaultData, Account, Status } from '../types';
import FixedU128 from '@/utils/fixed_u128';

export const balancesSelector: Selector<BalanceData[]> = state => state.account.balancas;

export const specBalanceSelector: (asset: number) => Selector<FixedU128> = asset => {
    return state => {
        const balances = state.account.balancas;
        const result = balances.find(item => item.asset === asset);

        return result ? result.balance : FixedU128.fromNatural(0);
    };
};

// add account prefix to avoid conflict
export const accountVaultsSelector: Selector<UserVaultData[]> = state => {
    const vaults = state.account.vaults;

    // filter empty vault
    return vaults.filter(item => {
        return !item.collateral.isZero() || !item.debit.isZero();
    });
};

export const specUserVaultSelector: (asset: number) => Selector<UserVaultData | undefined> = asset => {
    return state => {
        const vault = state.account.vaults;
        return vault.find(item => item.asset === asset);
    };
};

export const accountSelector: Selector<Account> = state => state.account.account;

export const extensionStatusSelector: Selector<Status> = state => state.account.extensionStatus;
