import React, { useEffect } from 'react';
import {
    Grid,
    List,
    ListItem,
    Typography,
    InputAdornment,
    makeStyles,
    createStyles,
    withStyles,
    Theme,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import { formatRatio, formatPrice, formatBalance } from '@/components/formatter';
import { formContext } from './context';
import { getAssetName } from '@/utils';
import { useSelector } from 'react-redux';
import { specCdpTypeSelector, specPriceSelector, constantsSelector } from '@/store/chain/selectors';
import { useForm } from '@/hooks/form';
import { specBalanceSelector } from '@/store/account/selectors';
import FixedU128 from '@/utils/fixed_u128';
import {
    calcCollateralRatio,
    calcStableFee,
    calcCanGenerater,
    calcLiquidationPrice,
    collateralToUSD,
} from '@/utils/loan';
import { STABLE_COIN } from '@/config';
import useMobileMatch from '@/hooks/mobile-match';
import Bottom from './bottom';
import Card from '@/components/card';
import { NumberInput } from '@/components/number-input';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        numberInput: {
            width: '50%',
            marginBottom: theme.spacing(4),
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        label: {
            marginBottom: theme.spacing(4),
            ...createTypography(17, 24, 500, 'Roboto', theme.palette.primary.light),
        },
        helper: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.spacing(4),
            ...createTypography(15, 20, 400, 'Roboto', theme.palette.secondary.main),
        },
        list: {
            padding: theme.spacing(4),
            background: 'rgba(161, 161, 161, 0.11)',
        },
        bottom: {
            marginTop: theme.spacing(4),
            [theme.breakpoints.down('sm')]: {
                marginTop: 44,
            },
        },
        note: {
            width: 352,
            ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                marginBottom: 44,
            },
        },
    }),
);

const InfoItem = withStyles((theme: Theme) => ({
    root: {
        padding: '4px 0',
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
    },
}))(ListItem);

const Title = withStyles(() => ({
    root: {
        marginBottom: 27,
        ...createTypography(18, 22, 400),
    },
}))(Typography);

const InfoListItemValue = withStyles((theme: Theme) => ({
    root: {
        font: 'inherit',
        color: theme.palette.primary.light,
    },
}))(Typography);

const InfoListItem: React.FC<{ name: string; value: string | number }> = ({ name, value }) => {
    return (
        <InfoItem button>
            <Grid container justify="space-between">
                <span>{name}</span>
                <InfoListItemValue>{value}</InfoListItemValue>
            </Grid>
        </InfoItem>
    );
};

interface Props {
    onNext: () => void;
    onPrev: () => void;
    onCancel: () => void;
}

const Component: React.FC<Props> = ({ onNext, onPrev, onCancel }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    const match = useMobileMatch('sm');
    const { data, setValue, setError, clearError } = useForm(formContext);
    const selectedAsset = data.asset.value;
    const collateral = FixedU128.fromNatural(data.collateral.value);
    const borrow = FixedU128.fromNatural(data.borrow.value);
    const assetName = getAssetName(selectedAsset);
    const stableCoinAssetName = getAssetName(STABLE_COIN);
    const cdpType = useSelector(specCdpTypeSelector(selectedAsset));
    const balance = useSelector(specBalanceSelector(selectedAsset));
    const [collateralPrice, stableCoinPrice] = useSelector(specPriceSelector([selectedAsset, STABLE_COIN]));
    const constants = useSelector(constantsSelector);

    useEffect(() => {
        // reset to empty
        setValue('collateral', '');
        setValue('borrow', '');
    }, []);

    if (!cdpType || !constants) {
        return null;
    }

    const maxBorrowd = calcCanGenerater(
        collateralToUSD(collateral, collateralPrice),
        FixedU128.fromNatural(0),
        cdpType.requiredCollateralRatio,
        stableCoinPrice,
    );

    const collateralRatio = calcCollateralRatio(collateralToUSD(collateral, collateralPrice), borrow);

    const handleNextBtnClick = () => {
        // ensure no error
        if (data.collateral.error || data.borrow.error) {
            return false;
        }
        // ensure collateral is not empty
        if (!data.collateral.value) {
            setError('collateral', 'collateral should not be zero');
            return false;
        }
        // ensure required collateral ratio
        if (cdpType.requiredCollateralRatio.isGreaterThan(collateralRatio)) {
            return false;
        }
        onNext();
    };

    const handleCollateralInput = (value: number) => {
        clearError('collateral');
        setValue('collateral', value);
    };

    const handleBorrowInput = (value: number) => {
        clearError('borrow');
        setValue('borrow', value);
    };

    const renderInfo = () => {
        return (
            <Grid item xs={12} lg={4}>
                {cdpType && (
                    <List classes={{ root: classes.list }} disablePadding>
                        <InfoListItem name={t('Collateralization')} value={assetName} />
                        <InfoListItem name={t('Collateralization Ratio')} value={formatRatio(collateralRatio)} />
                        <InfoListItem
                            name={t('{{asset}} Price', { asset: assetName })}
                            value={formatPrice(collateralPrice, '$')}
                        />
                        <InfoListItem
                            name={t('Interest Rate')}
                            value={formatRatio(calcStableFee(cdpType.stabilityFee, constants.babe.expectedBlockTime))}
                        />
                        <InfoListItem
                            name={t('Liquidation Price')}
                            value={formatPrice(calcLiquidationPrice(borrow, cdpType.liquidationRatio), '$')}
                        />
                        <InfoListItem name={t('Liquidation Ratio')} value={formatRatio(cdpType.liquidationRatio)} />
                        <InfoListItem name={t('Liquidation Penalty')} value={formatRatio(cdpType.liquidationPenalty)} />
                    </List>
                )}
            </Grid>
        );
    };

    const renderBottom = () => {
        return (
            <Grid container className={classes.bottom} justify="space-between">
                <Typography className={classes.note}>{t('ADD_VAULT_GENERATE_STABLE_COIN_NOTE')}</Typography>
                <Grid item>
                    <Bottom onNext={handleNextBtnClick} onPrev={onPrev} onCancel={onCancel} />
                </Grid>
            </Grid>
        );
    };

    return (
        <Card elevation={1} size="large">
            {match ? <Title>{t('Generate {{asset}}', { asset: getAssetName(STABLE_COIN) })}</Title> : ''}
            <Grid container>
                <Grid item xs={12} lg={8}>
                    <Typography className={classes.label}>
                        {t('How much {{asset}} would you deposit as collateral?', {
                            asset: assetName,
                        })}
                    </Typography>
                    <NumberInput
                        className={classes.numberInput}
                        onChange={handleCollateralInput}
                        max={balance.toNumber()}
                        min={0}
                        error={data.collateral.error}
                        onError={() => setError('collateral', 'some_error')}
                        helperText={
                            <>
                                <span style={{ marginRight: 30 }}>{t('Max to Lock')}</span>
                                <span>{formatBalance(balance, assetName)}</span>
                            </>
                        }
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{assetName}</InputAdornment>,
                        }}
                        FormHelperTextProps={{
                            classes: { root: classes.helper },
                        }}
                    />
                    <Typography className={classes.label}>{t('How much aUSD would you like to borrow?')}</Typography>
                    <NumberInput
                        className={classes.numberInput}
                        onChange={handleBorrowInput}
                        max={maxBorrowd.toNumber()}
                        min={0}
                        error={data.borrow.error}
                        onError={() => setError('borrow', 'some_error')}
                        helperText={
                            <>
                                <span style={{ marginRight: 30 }}>{t('Max available to borrow')}</span>
                                <span>{formatBalance(maxBorrowd, stableCoinAssetName)}</span>
                            </>
                        }
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{'aUSD'}</InputAdornment>,
                        }}
                        FormHelperTextProps={{
                            classes: { root: classes.helper },
                        }}
                    />
                </Grid>
                {match ? null : renderInfo()}
            </Grid>
            {renderBottom()}
            {match ? renderInfo() : null}
        </Card>
    );
};

export default Component;
