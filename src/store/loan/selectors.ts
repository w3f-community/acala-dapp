import { Selector, TxStatus, Tx, UserLoanData } from '@/types/store';
import { filter } from 'rxjs/operators';

type StatusType = 'updateLoan';
export const statusSelector: (type: StatusType) => Selector<TxStatus> = type => {
    return state => {
        return state.loan[`${type}Status`];
    };
};

export const loanTxRecordSelector: (account: string) =>  Selector<Tx[]> = account => state => {
    return state.loan.txRecord.slice().filter(item => {
        return item.signer === account;
    }).reverse();
}

// add account prefix to avoid conflict
export const loansSelector: Selector<UserLoanData[]> = state => {
    const loans = state.loan.loans;

    // filter empty loan
    return loans.filter(item => {
        return !item.collateral.isZero() || !item.debit.isZero();
    });
};

export const specUserLoanSelector: (asset: number) => Selector<UserLoanData | undefined> = asset => {
    return state => {
        const loan = state.loan.loans;
        return loan.find(item => item.asset === asset);
    };
};
