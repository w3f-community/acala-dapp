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
import { cdpTypeSelector } from '@/store/chain/selectors';
import { balancesSelector } from '@/store/account/selectors';
import { CdpTypeData } from '@/types/store';
import { createTypography } from '@/theme';
import { useForm } from '@/hooks/form';
import { formContext } from './context';
import FixedU128 from '@/utils/fixed_u128';
import { calcStableFee } from '@/utils/vault';
import useMobileMatch from '@/hooks/mobile-match';
import SelectCollateralMobile from './select-collateral-mobile';
import Card from '@/components/card';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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

const filterEmptyVault = (source: CdpTypeData[]): CdpTypeData[] => {
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
    const classes = useStyles();
    const { data, setValue } = useForm(formContext);
    const selectedAsset = data.asset.value;
    const cdpTypes = filterEmptyVault(useSelector(cdpTypeSelector));
    const balances = useSelector(balancesSelector);
    const mobileMatch = useMobileMatch('sm');

    const handleNextBtnClick = () => onNext();

    const handleAssetRadioSelect: ReactEventHandler<HTMLInputElement> = e => {
        const asset = Number(e.currentTarget.value);
        setValue('asset', asset);
    };

    useEffect(() => {
        // auto select first
        if (!data.asset.value && cdpTypes.length !== 0) {
            setValue('asset', cdpTypes[0].asset);
        }
    }, [cdpTypes, data.asset.value, setValue]);

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
            <Grid container justify={mobileMatch ? 'space-between' : 'flex-end'} className={classes.bottom}>
                <Button variant="contained" color="secondary" onClick={onCancel}>
                    {t('Cancel')}
                </Button>
                <Button variant="contained" color="primary" onClick={handleNextBtnClick}>
                    {t('Next')}
                </Button>
            </Grid>
        );
    };

    // ensure cdpTypes is not empty
    if (!cdpTypes.length) {
        return null;
    }

    if (mobileMatch) {
        return (
            <SelectCollateralMobile
                renderBottom={renderBottom}
                cdpTypes={cdpTypes}
                balances={balancesMap}
                onSelect={(asset: number) => setValue('asset', asset)}
                selected={data.asset.value}
            />
        );
    }

    return (
        <Card elevation={1} size="large">
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
                    {cdpTypes.map(item => (
                        <TableRow key={`select-collateral-asset-${item.asset}`}>
                            <SBodyCell>
                                <Radio
                                    value={item.asset}
                                    onChange={handleAssetRadioSelect}
                                    checked={selectedAsset === item.asset}
                                    disabled={item.stabilityFee.isZero()}
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
        </Card>
    );
};

export default Component;
