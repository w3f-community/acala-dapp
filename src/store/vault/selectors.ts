import { Selector, TxStatus, Tx } from '@/types/store';

type StatusType = 'updateVault';
export const statusSelector: (type: StatusType) => Selector<TxStatus> = type => {
    return state => {
        return state.vault[`${type}Status`];
    };
};

export const vaultTxRecordSelector: Selector<Tx[]> = state => state.vault.txRecord.slice().reverse();
