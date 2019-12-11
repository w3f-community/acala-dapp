import React, { ReactEventHandler, FormEvent } from 'react';
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
    withStyles,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import Formatter from '@/components/formatter';
import { useSelector } from 'react-redux';
import { vaultsSelector } from '@/store/chain/selectors';
import { specBalanceSelector } from '@/store/user/selectors';
import { BaseVaultData } from '@/store/types';
import { createTypography } from '@/theme';
import { useForm } from '@/hooks/form';
import { formContext } from './context';

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

const filterEmptyVault = (source: BaseVaultData[]): BaseVaultData[] => {
    return source.filter(
        item =>
            (item.debitExchangeRate ||
                item.liquidationPenalty ||
                item.liquidationRatio ||
                item.maximumTotalDebitValue ||
                item.requiredCollateralRatio ||
                item.stabilityFee) !== 0,
    );
};

interface Props {
    onNext: () => void;
    onCancel: () => void;
}

const Component: React.FC<Props> = ({ onNext, onCancel }) => {
    const { t } = useTranslate();
    // set default value
    const cardClasses = useCardStyles();
    const { data, setValue } = useForm(formContext);
    const selectedAsset = data.asset.value;
    const vaults = filterEmptyVault(useSelector(vaultsSelector));
    const balances = useSelector(specBalanceSelector(selectedAsset));

    const handleNextBtnClick = () => onNext();

    const handleAssetRadioSelect: ReactEventHandler<HTMLInputElement> = e => {
        const asset = Number(e.currentTarget.value);
        setValue('asset', asset);
    };

    return (
        <Paper square={true} elevation={1} className={cardClasses.root}>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledHeaderCell>{t('Collateral Type')}</StyledHeaderCell>
                        <StyledHeaderCell>{t('Interest Rate')}</StyledHeaderCell>
                        <StyledHeaderCell>{t('LIQ Ratio')}</StyledHeaderCell>
                        <StyledHeaderCell>{t('LIQ Fee')}</StyledHeaderCell>
                        <StyledHeaderCell>{t('Avail. Balance')}</StyledHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vaults.map(item => (
                        <TableRow key={`select-collateral-asset-${item.asset}`}>
                            <StyledBodyCell>
                                <Radio
                                    value={item.asset}
                                    onChange={handleAssetRadioSelect}
                                    checked={selectedAsset === item.asset}
                                />
                                {getAssetName(item.asset)}
                            </StyledBodyCell>
                            <StyledBodyCell>
                                <Formatter data={item.stabilityFee} type="ratio" />
                            </StyledBodyCell>
                            <StyledBodyCell>
                                <Formatter data={item.liquidationRatio} type="ratio" />
                            </StyledBodyCell>
                            <StyledBodyCell>
                                <Formatter data={item.liquidationPenalty} type="ratio" />
                            </StyledBodyCell>
                            <StyledBodyCell>
                                <Formatter data={balances} type="balance" suffix={getAssetName(item.asset)} />
                            </StyledBodyCell>
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
