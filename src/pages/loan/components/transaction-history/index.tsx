import React from 'react';
import Card from '@/components/card';
import { Typography, Table, TableBody, TableHead, TableRow, TableCell, Theme, withStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import { createTypography } from '@/theme';
import { useSelector } from 'react-redux';
import { txRecordSelector } from '@/store/app/selectors';
import Moment from 'dayjs';

const StyledBodyCell = withStyles((theme: Theme) => ({
    root: {
        borderBottom: 'none',
        color: theme.palette.text.secondary,
    },
}))(TableCell);

const StyledHeaderCell = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.common.black,
        ...createTypography(15, 22, 600, 'Roboto'),
    },
}))(TableCell);

interface Props {
    current: number;
}

const TransactionHistory: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const txRecord = useSelector(txRecordSelector);

    if (!current || !txRecord.length) {
        return null;
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
                        <StyledHeaderCell>{t('From')}</StyledHeaderCell>
                        <StyledHeaderCell>{t('Tx Hash')}</StyledHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {txRecord.map(({ data, time, type, hash }) => (
                        <TableRow key={`transaction-history-${hash}`}>
                            <StyledBodyCell>{getAssetName(data.asset)}</StyledBodyCell>
                            <StyledBodyCell>{type}</StyledBodyCell>
                            <StyledBodyCell>{Moment(time).format('YYYY/MM/DD HH:mm')}</StyledBodyCell>
                            <StyledBodyCell>{''}</StyledBodyCell>
                            <StyledBodyCell>{hash.slice(0, 10) + '...'}</StyledBodyCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default TransactionHistory;
