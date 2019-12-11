import { Selector } from '@/types/store';
import { BalanceData, TxStatus } from '../types';

type StatusType = 'updateVault';
export const statusSelector: (type: StatusType) => Selector<TxStatus> = type => {
    return state => {
        return state.vault[`${type}Status`];
    };
};
