import React from 'react';
import Card from '@/components/card';
import {
    Typography,
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    makeStyles,
    Theme,
    createStyles,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import { createTypography } from '@/theme';
import { TransactionHistoryData } from '../../index.types';

const useBodyCellStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderBottom: 'none',
            color: theme.palette.text.secondary,
        },
    }),
);

const useHeaderCellStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: theme.palette.common.black,
            ...createTypography(15, 22, 600, 'Roboto'),
        },
    }),
);

interface Props {
    data: TransactionHistoryData[];
}

const a: any = 'hello';

const TransactionHistory: React.FC<Props> = ({ data }) => {
    const { t } = useTranslate();
    const bodyCellClasses = useBodyCellStyle();
    const headerCellClasses = useHeaderCellStyle();
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
                        <TableCell classes={headerCellClasses}>{t('Token')}</TableCell>
                        <TableCell classes={headerCellClasses}>{t('Action')}</TableCell>
                        <TableCell classes={headerCellClasses}>{t('When')}</TableCell>
                        <TableCell classes={headerCellClasses}>{t('From')}</TableCell>
                        <TableCell classes={headerCellClasses}>{t('Tx Hash')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(({ asset, action, when, from, tx }) => (
                        <TableRow key={`transaction-history-${asset}-${tx}`}>
                            <TableCell classes={bodyCellClasses}>{getAssetName(asset)}</TableCell>
                            <TableCell classes={bodyCellClasses}>{action}</TableCell>
                            <TableCell classes={bodyCellClasses}>{when}</TableCell>
                            <TableCell classes={bodyCellClasses}>{from}</TableCell>
                            <TableCell classes={bodyCellClasses}>{tx}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default TransactionHistory;
