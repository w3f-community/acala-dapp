import React from 'react';
import Card from '@/components/card';
import { Typography, Table, TableBody, TableHead, TableRow, TableCell, Theme, withStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import { createTypography } from '@/theme';
import { TransactionHistoryData } from '../../index.types';

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
    data: TransactionHistoryData[];
}

const TransactionHistory: React.FC<Props> = ({ data }) => {
    const { t } = useTranslate();

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
                    {data.map(({ asset, action, when, from, tx }) => (
                        <TableRow key={`transaction-history-${asset}-${tx}`}>
                            <StyledBodyCell>{getAssetName(asset)}</StyledBodyCell>
                            <StyledBodyCell>{action}</StyledBodyCell>
                            <StyledBodyCell>{when}</StyledBodyCell>
                            <StyledBodyCell>{from}</StyledBodyCell>
                            <StyledBodyCell>{tx}</StyledBodyCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default TransactionHistory;
