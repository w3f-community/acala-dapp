import React from 'react';
import { Typography } from '@material-ui/core';
import Moment from 'dayjs';
import { useSelector } from 'react-redux';

import Card from '@honzon-platform/apps/components/card';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import { getAssetName, formatHash } from '@honzon-platform/apps/utils';
import useMobileMatch from '@honzon-platform/apps/hooks/mobile-match';

import TxDetail from '@honzon-platform/apps/components/tx-detail';
import { LinkToPolkascan } from '@honzon-platform/apps/components/link-to/polkascan';
import { Table } from '@honzon-platform/apps/components/table';
import { Tx } from '@honzon-platform/apps/types/store';
import { accountStoreSelector } from '@honzon-platform/apps/store/account/selectors';

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
