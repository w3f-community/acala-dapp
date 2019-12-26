import React, { ReactEventHandler, useEffect, ChangeEvent } from 'react';
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
import { balancesSelector } from '@/store/account/selectors';
import { BaseVaultData } from '@/types/store';
import { createTypography } from '@/theme';
import { useForm } from '@/hooks/form';
import { formContext } from './context';
import FixedU128 from '@/utils/fixed_u128';
import { calcStableFee } from '@/utils/vault';
import useMobileMatch from '@/hooks/mobile-match';
import SelectCollateralMobile from './select-collateral-mobile';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: { padding: '66px 35px 60px 29px' },
        bottom: {
            paddingTop: 73,
            '& .MuiButton-root': {
                marginLeft: theme.spacing(2),
            },
            [theme.breakpoints.down('sm')]: {
                paddingTop: 32,
                '& .MuiButton-root': {
                    marginLeft: 0,
                },
            },
        },
    }),
);

const SBodyCell = withStyles((theme: Theme) => ({
    root: {
        borderBottom: 'none',
        color: theme.palette.text.secondary,
    },
}))(TableCell);

const SHeaderCell = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.common.black,
        ...createTypography(15, 22, 500, 'Roboto'),
    },
}))(TableCell);

const filterEmptyVault = (source: BaseVaultData[]): BaseVaultData[] => {
    return source.filter(
        item =>
            !item.debitExchangeRate.isZero() ||
            !item.liquidationPenalty.isZero() ||
            !item.liquidationRatio.isZero() ||
            !item.maximumTotalDebitValue.isZero() ||
            !item.requiredCollateralRatio.isZero() ||
            !item.stabilityFee.isZero(),
    );
};

interface Props {
    onNext: () => void;
    onCancel: () => void;
}

const Component: React.FC<Props> = ({ onNext, onCancel }) => {
    const { t } = useTranslate();
    // set default value
    const classes = useStyles();
    const { data, setValue } = useForm(formContext);
    const selectedAsset = data.asset.value;
    const vaults = filterEmptyVault(useSelector(vaultsSelector));
    const balances = useSelector(balancesSelector);
    const match = useMobileMatch('sm');

    const handleNextBtnClick = () => onNext();

    const handleAssetRadioSelect: ReactEventHandler<HTMLInputElement> = e => {
        const asset = Number(e.currentTarget.value);
        setValue('asset', asset);
    };

    useEffect(() => {
        // auto select
        if (!data.asset.value && vaults.length !== 0) {
            setValue('asset', vaults[0].asset);
        }
    }, [vaults, data.asset.value, setValue]);

    const handleAssetSelect = (e: ChangeEvent<{ value: unknown }>) => {
        const result = Number(e.target.value);
        setValue('asset', result);
    };

    if (!balances.length) {
        return null;
    }

    // convert array to map
    const balancesMap = balances.reduce<{ [k: number]: FixedU128 }>(
        (acc, cur) => ({ ...acc, [cur.asset]: cur.balance }),
        {},
    );

    const renderBottom = () => {
        return (
            <Grid container justify={match ? 'space-between' : 'flex-end'} className={classes.bottom}>
                <Button variant="contained" color="secondary" onClick={onCancel}>
                    {t('Cancel')}
                </Button>
                <Button variant="contained" color="primary" onClick={handleNextBtnClick}>
                    {t('Next')}
                </Button>
            </Grid>
        );
    };

    // ensure vaults is not empty
    if (!vaults.length) {
        return null;
    }

    if (match) {
        return (
            <SelectCollateralMobile
                renderBottom={renderBottom}
                vaults={vaults}
                balances={balancesMap}
                onSelect={handleAssetSelect}
                selected={data.asset.value}
            />
        );
    }

    return (
        <Paper square={true} elevation={1} className={classes.root}>
            <Table>
                <TableHead>
                    <TableRow>
                        <SHeaderCell>{t('Collateral Type')}</SHeaderCell>
                        <SHeaderCell>{t('Interest Rate')}</SHeaderCell>
                        <SHeaderCell>{t('LIQ Ratio')}</SHeaderCell>
                        <SHeaderCell>{t('LIQ Fee')}</SHeaderCell>
                        <SHeaderCell>{t('Avail. Balance')}</SHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vaults.map(item => (
                        <TableRow key={`select-collateral-asset-${item.asset}`}>
                            <SBodyCell>
                                <Radio
                                    value={item.asset}
                                    onChange={handleAssetRadioSelect}
                                    checked={selectedAsset === item.asset}
                                />
                                {getAssetName(item.asset)}
                            </SBodyCell>
                            <SBodyCell>
                                <Formatter data={calcStableFee(item.stabilityFee)} type="ratio" />
                            </SBodyCell>
                            <SBodyCell>
                                <Formatter data={item.liquidationRatio} type="ratio" />
                            </SBodyCell>
                            <SBodyCell>
                                <Formatter data={item.liquidationPenalty} type="ratio" />
                            </SBodyCell>
                            <SBodyCell>
                                <Formatter
                                    data={balancesMap[item.asset] || 0}
                                    type="balance"
                                    suffix={getAssetName(item.asset)}
                                />
                            </SBodyCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {renderBottom()}
        </Paper>
    );
};

export default Component;
