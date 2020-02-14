import React from 'react';
import Card from '@/components/card';
import { Typography, Grid } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { formatHash } from '@/utils';
import { useSelector } from 'react-redux';
import Moment from 'dayjs';
import { loanTxRecordSelector } from '@/store/loan/selectors';
import Skeleton from '@material-ui/lab/Skeleton';

interface Props {
    asset: number;
    account: string;
}

const TransactionHistory: React.FC<Props> = ({ asset, account }) => {
    const { t } = useTranslate();
    const txRecord = useSelector(loanTxRecordSelector(account));

    if (!asset || !txRecord.length) {
        return <Skeleton variant="rect" height={240} />;
    }

    return (
        <Card
            size="large"
            elevation={1}
            header={<Typography variant="subtitle1">{t('Transaction History')}</Typography>}
            divider={false}
        >
            {txRecord.map(item => {
                return (
                    <div key={`${item.type}-${item.hash}`}>
                        <Grid container justify="space-between">
                            <Grid item>{t('Action')}</Grid>
                            <Grid item>{item.type}</Grid>
                        </Grid>
                        <Grid container justify="space-between">
                            <Grid item>{t('When')}</Grid>
                            <Grid item>{Moment(item.time).format('YYYY/MM/DD HH:mm')}</Grid>
                        </Grid>
                        <Grid container justify="space-between">
                            <Grid item>{t('Tx Hash')}</Grid>
                            <Grid item>{formatHash(item.hash)}</Grid>
                        </Grid>
                    </div>
                );
            })}
        </Card>
    );
};

export default TransactionHistory;
