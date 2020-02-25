import React, { FC } from 'react';
import Card from '@/components/card';
import { useTranslate } from '@/hooks/i18n';
import { useSelector } from 'react-redux';
import { TableItem, Table } from '@/components/table';
import FixedU128 from '@/utils/fixed_u128';
import { getAssetName } from '@/utils';
import { formatBalance } from '@/components/formatter';
import { airdropSelector } from '@/store/account/selectors';
import { airDropAssets } from '@/config';

interface TableItemData {
    asset: number;
    balance: FixedU128;
}

export const AirDrop: FC = () => {
    const { t } = useTranslate();
    const airdrop = useSelector(airdropSelector);

    if (!airdrop) {
        return null;
    }

    const data = airdrop.map(item => {
        return {
            asset: item.asset,
            balance: item.balance,
        };
    });

    const config: TableItem<TableItemData>[] = [
        {
            title: t('Token'),
            renderKey: 'asset',
            render: asset => getAssetName(asset, airDropAssets),
            cellProps: {
                style: {
                    width: 150 
                }
            }
        },
        {
            title: t('Balance'),
            renderKey: 'balance',
            render: balance => formatBalance(balance)
        },
        {
            title: '',
            renderKey: '',
            render: () => <div/>
        }
    ];

    return (
        <Card header={t('AirDrop')} size="large" elevation={1} divider={false}>
            <Table<TableItemData> config={config} data={data} />
        </Card>
    );
};
