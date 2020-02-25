import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { accountStoreSelector } from '@/store/account/selectors';
import TxHistory from '@/components/tx-history';
import { TxRecordSelector } from '@/store/app/selectors';

const TransferHistory: FC = () => {
    const [account] = useSelector(accountStoreSelector(['account']));
    const txRecord = useSelector(TxRecordSelector('transfer', account!.address));
    console.log(txRecord);
    return (
        <TxHistory data={txRecord} />
    );
};

export default TransferHistory;
