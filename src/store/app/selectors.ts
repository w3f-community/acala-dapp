import { Selector, Tx, TxType } from '@/types/store';
import { AnyFunction } from '@polkadot/types/types';

export const transactionsSelector: Selector<Tx[]> = state => state.app.transactions;

export const txRecordSelector: (type: TxType, account: string, filterFn?: (data: Tx) => boolean) => Selector<Tx[]> = (
    type,
    account,
    filterFn,
) => state => {
    return state.app.txRecord
        .slice()
        .filter(item => {
            return item.signer === account && item.type === type;
        })
        .filter(item => {
            if (filterFn) {
                return filterFn(item);
            }
            return true;
        })
        .reverse();
};
