import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { accountStoreSelector } from '@/store/account/selectors';
import TxHistory from '@/components/tx-history';
import { txRecordSelector } from '@/store/app/selectors';

interface Props {
    current: number;
}
const TransactionHistory: FC<Props> = ({ current }) => {
    const [account] = useSelector(accountStoreSelector(['account']));
    const txRecord = useSelector(txRecordSelector('updateLoan', account!.address, tx => tx.data.asset === current));
    return <TxHistory data={txRecord} />;
};

export default TransactionHistory;
