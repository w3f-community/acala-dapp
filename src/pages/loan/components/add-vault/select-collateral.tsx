import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Grid, Button, Radio } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { Vault as OriginVault } from '../../index.types';
import { getAssetName } from '@/utils';
import Formatter from '@/components/formatter';

export type Vault = Required<Omit<OriginVault, 'liquidationPrice'>>;

interface Props {
    data: Required<Vault>[];
}

const Component: React.FC<Props> = ({ data }) => {
    const { t } = useTranslate();
    return (
        <Paper elevation={1}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t('Collateral Type')}</TableCell>
                        <TableCell>{t('Interest Rate')}</TableCell>
                        <TableCell>{t('LIQ Ratio')}</TableCell>
                        <TableCell>{t('LIQ Fee')}</TableCell>
                        <TableCell>{t('Avail. Balance')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(item => (
                        <TableRow>
                            <TableCell>
                                <Radio />
                                {getAssetName(item.asset)}
                            </TableCell>
                            <TableCell>
                                <Formatter data={item.stabilityFee} type="ratio" />
                            </TableCell>
                            <TableCell>{getAssetName(item.asset)}</TableCell>
                            <TableCell>{getAssetName(item.asset)}</TableCell>
                            <TableCell>{getAssetName(item.asset)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Grid container justify="flex-end">
                <Button variant="contained" color="secondary">
                    {t('Cancel')}
                </Button>
                <Button variant="contained" color="primary">
                    {t('Next')}
                </Button>
            </Grid>
        </Paper>
    );
};

export default Component;
