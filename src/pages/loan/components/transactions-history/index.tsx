import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { loanTxRecordSelector } from '@/store/loan/selectors';
import { accountStoreSelector } from '@/store/account/selectors';
import TxHistory from '@/components/tx-history';

const TransactionHistory: FC = () => {
    const [account] = useSelector(accountStoreSelector(['account']));
    const txRecord = useSelector(loanTxRecordSelector(account!.address));
    return <TxHistory data={txRecord} />;
};

export default TransactionHistory;
