import { Selector, TxStatus, Tx, UserVaultData } from '@/types/store';

type StatusType = 'updateVault';
export const statusSelector: (type: StatusType) => Selector<TxStatus> = type => {
    return state => {
        return state.vault[`${type}Status`];
    };
};

export const vaultTxRecordSelector: Selector<Tx[]> = state => state.vault.txRecord.slice().reverse();

// add account prefix to avoid conflict
export const vaultsSelector: Selector<UserVaultData[]> = state => {
    const vaults = state.vault.vaults;

    // filter empty vault
    return vaults.filter(item => {
        return !item.collateral.isZero() || !item.debit.isZero();
    });
};

export const specUserVaultSelector: (asset: number) => Selector<UserVaultData | undefined> = asset => {
    return state => {
        const vault = state.vault.vaults;
        return vault.find(item => item.asset === asset);
    };
};
