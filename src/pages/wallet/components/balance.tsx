import React, { FC, useState } from 'react';
import Card from '@/components/card';
import { useTranslate } from '@/hooks/i18n';
import { useSelector } from 'react-redux';
import { balancesSelector } from '@/store/account/selectors';
import { pricesFeedSelector } from '@/store/chain/selectors';
import { TableItem, Table } from '@/components/table';
import FixedU128 from '@/utils/fixed_u128';
import { getAssetName } from '@/utils';
import { formatBalance, formatPrice } from '@/components/formatter';
import { Button } from '@material-ui/core';
import { TransferModal } from './transfer-modal';

interface TableItemData {
    asset: number;
    balance: FixedU128;
    price: FixedU128;
    amount: FixedU128;
}

export const Balance: FC = () => {
    const { t } = useTranslate();
    const balances = useSelector(balancesSelector);
    const prices = useSelector(pricesFeedSelector);
    const [showTransfer, setShowTransfer] = useState<boolean>(false);
    const [activeAssset, setActiveAsset] = useState<number>(0);

    if (!balances || !prices) {
        return null;
    }

    const onShowTransfer = (asset: number) => {
        setActiveAsset(asset);
        setShowTransfer(true);
    };
    const onCloseTransfer = () => {
        setShowTransfer(false);
    };
    const data = balances.map(item => {
        const price = prices.find(price => price.asset === item.asset);
        return {
            asset: item.asset,
            balance: item.balance,
            price: price ? price.price : FixedU128.ZERO,
            amount: price ? price.price.mul(item.balance) : FixedU128.ZERO,
        };
    });
    const config: TableItem<TableItemData>[] = [
        {
            title: t('Token'),
            renderKey: 'asset',
            render: asset => getAssetName(asset),
        },
        {
            title: t('Balance'),
            renderKey: 'balance',
            render: balance => formatBalance(balance),
        },
        {
            title: t('Price'),
            renderKey: 'price',
            render: price => formatPrice(price, '$'),
        },
        {
            title: t('Amount'),
            renderKey: 'amount',
            render: amount => formatPrice(amount, '$'),
        },
        {
            title: t('Action'),
            renderKey: '',
            render: (_, data) => (
                <Button variant="contained" color="primary" onClick={() => onShowTransfer(data.asset)}>
                    {t('Transfer')}
                </Button>
            ),
        },
    ];

    return (
        <Card header={t('Balances')} size="large" elevation={1} divider={false}>
            <Table<TableItemData> config={config} data={data} />
            { showTransfer && <TransferModal asset={activeAssset} open={showTransfer} onClose={onCloseTransfer} /> }
        </Card>
    );
};
