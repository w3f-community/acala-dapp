import { Selector, Tx, TxType } from '@/types/store';

export const transactionsSelector: Selector<Tx[]> = state => state.app.transactions;

export const TxRecordSelector: (type: TxType, account: string) => Selector<Tx[]> = (type, account) => state => {
    return state.app.txRecord
        .slice()
        .filter(item => {
            return item.signer === account && item.type === type;
        })
        .reverse();
};
