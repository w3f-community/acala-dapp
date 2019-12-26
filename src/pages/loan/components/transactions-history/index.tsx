import React from 'react';
import Card from '@/components/card';
import { Typography, Table, TableBody, TableHead, TableRow, TableCell, Theme, withStyles } from '@material-ui/core';
import Moment from 'dayjs';
import { useSelector } from 'react-redux';

import { useTranslate } from '@/hooks/i18n';
import { getAssetName, formatHash } from '@/utils';
import { createTypography } from '@/theme';
import { vaultTxRecordSelector } from '@/store/vault/selectors';
import Skeleton from '@material-ui/lab/Skeleton';
import useMobileMatch from '@/hooks/mobile-match';

import Mobile from './mobile';
import TxDetail from '@/components/tx-detail';

const StyledBodyCell = withStyles((theme: Theme) => ({
    root: {
        borderBottom: 'none',
        color: theme.palette.text.secondary,
    },
}))(TableCell);

const StyledHeaderCell = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.common.black,
        ...createTypography(15, 22, 500, 'Roboto'),
    },
}))(TableCell);

interface Props {
    current: number;
}

const TransactionHistory: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const txRecord = useSelector(vaultTxRecordSelector);
    const match = useMobileMatch('sm');

    if (!current || !txRecord.length) {
        return <Skeleton variant="rect" height={240} />;
    }

    if (match) {
        return <Mobile current={current} />;
    }

    return (
        <Card
            size="large"
            elevation={1}
            header={<Typography variant="subtitle1">{t('Transaction History')}</Typography>}
            divider={false}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledHeaderCell>{t('Token')}</StyledHeaderCell>
                        <StyledHeaderCell>{t('Action')}</StyledHeaderCell>
                        <StyledHeaderCell>{t('When')}</StyledHeaderCell>
                        <StyledHeaderCell>{t('Tx Hash')}</StyledHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {txRecord.map(item => (
                        <TableRow key={`transaction-history-${item.hash}`}>
                            <StyledBodyCell>{getAssetName(item.data.asset)}</StyledBodyCell>
                            <StyledBodyCell>
                                <TxDetail data={item} />
                            </StyledBodyCell>
                            <StyledBodyCell>{Moment(item.time).format('YYYY/MM/DD HH:mm')}</StyledBodyCell>
                            <StyledBodyCell>{formatHash(item.hash)}</StyledBodyCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default TransactionHistory;
