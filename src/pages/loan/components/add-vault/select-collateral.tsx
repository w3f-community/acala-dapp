import React, { useState, ReactEventHandler } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Grid,
    Button,
    Radio,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { Vault as OriginVault } from '../../index.types';
import { getAssetName } from '@/utils';
import Formatter from '@/components/formatter';
import { BaseStepCard } from './index.types';

export type Vault = Required<Omit<OriginVault, 'liquidationPrice'>>;

interface Props extends Omit<BaseStepCard, 'onPrev'> {
    data: Vault[];
}

const useCardStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: { padding: '66px 35px 60px 29px' },
        bottom: {
            paddingTop: 73,
            '& .MuiButton-root': {
                marginLeft: theme.spacing(2),
            },
        },
    }),
);

const Component: React.FC<Props> = ({ data, onNext, onCancel }) => {
    const { t } = useTranslate();
    const [selectAsset, setSelectAsset] = useState();
    const cardClasses = useCardStyles();

    const handleNextBtnClick = () => {
        onNext();
    };

    const handleAssetRadioSelect: ReactEventHandler = ele => {
        console.log(ele);
    };

    return (
        <Paper square={true} elevation={1} className={cardClasses.root}>
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
                    {data.map(({ asset, stabilityFee }) => (
                        <TableRow key={`select-collateral-asset-${asset}`}>
                            <TableCell>
                                <Radio onSelect={handleAssetRadioSelect} />
                                {getAssetName(asset)}
                            </TableCell>
                            <TableCell>
                                <Formatter data={stabilityFee} type="ratio" />
                            </TableCell>
                            <TableCell>{getAssetName(asset)}</TableCell>
                            <TableCell>{getAssetName(asset)}</TableCell>
                            <TableCell>{getAssetName(asset)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Grid container justify="flex-end" className={cardClasses.bottom}>
                <Button variant="contained" color="secondary" onClick={onCancel}>
                    {t('Cancel')}
                </Button>
                <Button variant="contained" color="primary" onClick={handleNextBtnClick}>
                    {t('Next')}
                </Button>
            </Grid>
        </Paper>
    );
};

export default Component;
