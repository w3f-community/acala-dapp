import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { accountStoreSelector } from '@honzon-platform/apps/store/account/selectors';
import TxHistory from '@honzon-platform/apps/components/tx-history';
import { txRecordSelector } from '@honzon-platform/apps/store/app/selectors';

const TransferHistory: FC = () => {
    const [account] = useSelector(accountStoreSelector(['account']));
    const txRecord = useSelector(txRecordSelector('transfer', account!.address));
    if (!txRecord.length) {
        return null;
    }
    return <TxHistory data={txRecord} />;
};

export default TransferHistory;
