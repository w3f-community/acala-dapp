import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { accountStoreSelector } from '@/store/account/selectors';
import TxHistory from '@/components/tx-history';
import { txRecordSelector } from '@/store/app/selectors';

const TransferHistory: FC = () => {
    const [account] = useSelector(accountStoreSelector(['account']));
    const txRecord = useSelector(txRecordSelector('transfer', account!.address));
    if (!txRecord.length) {
        return null;
    }
    return <TxHistory data={txRecord} />;
};

export default TransferHistory;
