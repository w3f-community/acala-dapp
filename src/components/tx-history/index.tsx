import React from 'react';
import { Typography } from '@material-ui/core';
import Moment from 'dayjs';
import { useSelector } from 'react-redux';

import Card from '@/components/card';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName, formatHash } from '@/utils';
import { loanTxRecordSelector } from '@/store/loan/selectors';
import useMobileMatch from '@/hooks/mobile-match';

import Mobile from './mobile';
import TxDetail from '@/components/tx-detail';
import { LinkToPolkascan } from '@/components/link-to/polkascan';
import { Table } from '@/components/table';
import { Tx } from '@/types/store';
import { accountStoreSelector } from '@/store/account/selectors';

interface TableItem {
    asset: number;
    detail: Tx;
    time: string;
    tx: string;
}
interface Props {
    data: Tx[];
}

const TxHistory: React.FC<Props> = ({ data }) => {
    const { t } = useTranslate();
    const [account] = useSelector(accountStoreSelector(['account']));
    const match = useMobileMatch('sm');

    const tableConfig = [
        {
            renderKey: 'token',
            title: t('Token'),
            render: (text: string, record: TableItem) => getAssetName(record.asset),
        },
        {
            renderKey: 'detail',
            title: t('Action'),
            render: (detail: any) => <TxDetail data={detail} />,
        },
        {
            renderKey: 'time',
            title: t('When'),
            render: (time: string) => time,
        },
        {
            renderKey: 'tx',
            title: t('Tx Hash'),
            render: (tx: string) => <LinkToPolkascan extrinsic={tx}>{formatHash(tx)}</LinkToPolkascan>,
        },
    ];
    const tableData = data.map(item => ({
        asset: item.data.asset,
        detail: item,
        time: Moment(item.time).format('YYYY/MM/DD HH:mm'),
        tx: item.hash,
    }));

    return (
        <Card
            size="large"
            elevation={1}
            header={<Typography variant="subtitle1">{t('Transaction History')}</Typography>}
            divider={false}
        >
            <Table<TableItem> config={tableConfig} data={tableData} />
        </Card>
    );
};

export default TxHistory;
