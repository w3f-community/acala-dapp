import React, { FC } from 'react';
import Card from '@honzon-platform/apps/components/card';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import { useSelector } from 'react-redux';
import { TableItem, Table } from '@honzon-platform/apps/components/table';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import { getAssetName } from '@honzon-platform/apps/utils';
import { formatBalance } from '@honzon-platform/apps/components/formatter';
import { airdropSelector } from '@honzon-platform/apps/store/account/selectors';
import { airDropAssets } from '@honzon-platform/apps/config';

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
            render: asset => {
                let result = getAssetName(asset, airDropAssets);
                if (asset === 1) {
                    result += ' (Mainnet)';
                }
                return result;
            },
            cellProps: {
                style: {
                    width: 150,
                },
            },
        },
        {
            title: t('Balance'),
            renderKey: 'balance',
            render: balance => formatBalance(balance),
        },
        {
            title: '',
            renderKey: '',
            render: () => <div />,
        },
    ];

    return (
        <Card header={t('AirDrop')} size="large" elevation={1} divider={false}>
            <Table<TableItemData> config={config} data={data} />
        </Card>
    );
};
