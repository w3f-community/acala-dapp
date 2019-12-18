import React, { ChangeEvent } from 'react';
import {
    Grid,
    Button,
    Paper,
    TextField,
    List,
    ListItem,
    Typography,
    InputAdornment,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import { formatRatio, formatPrice, formatBalance } from '@/components/formatter';
import { formContext } from './context';
import { getAssetName } from '@/utils';
import { useSelector } from 'react-redux';
import { specVaultSelector, specPriceSelector } from '@/store/chain/selectors';
import { useForm } from '@/hooks/form';
import { specBalanceSelector } from '@/store/user/selectors';
import FixedU128 from '@/utils/fixed_u128';
import {
    calcCollateralRatio,
    calcStableFee,
    calcCanGenerater,
    calcLiquidationPrice,
    collateralToStableCoin,
} from '@/utils/vault';
import { STABLE_COIN } from '@/config';
import { withStyles } from '@material-ui/styles';

const useCardStyles = makeStyles(() =>
    createStyles({
        root: { padding: '66px 35px 60px 29px' },
    }),
);

const useInputStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: { width: '50%', marginBottom: 28 },
        label: {
            marginBottom: 22,
            ...createTypography(21, 28, 600, 'Roboto', theme.palette.primary.light),
        },
        helper: {
            marginTop: 28,
            ...createTypography(15, 20, 400, 'Roboto', theme.palette.common.black),
        },
    }),
);

const useListStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '39px 32px 37px 21px',
            background: 'rgba(161, 161, 161, 0.11)',
        },
    }),
);

const SListItem = withStyles(() => ({
    root: {
        ...createTypography(15, 22, 600, 'Roboto', '#424242'),
    },
}))(ListItem);

const useBottomStyles = makeStyles(() =>
    createStyles({
        root: {
            paddingTop: 73,
        },
        note: {
            width: 352,
            ...createTypography(14, 19, 400, 'Roboto', '#757575'),
        },
        linkBtn: {
            minWidth: 0,
            textDecoration: 'underline',
            color: '#757575',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    }),
);

const InfoListItem: React.FC<{ name: string; value: string | number }> = ({ name, value }) => {
    return (
        <SListItem button>
            <Grid container justify="space-between">
                <span>{name}</span>
                <span>{value}</span>
            </Grid>
        </SListItem>
    );
};

interface Props {
    onNext: () => void;
    onPrev: () => void;
    onCancel: () => void;
}

const Component: React.FC<Props> = ({ onNext, onPrev, onCancel }) => {
    const { t } = useTranslate();
    const cardClasses = useCardStyles();
    const inputClasses = useInputStyles();
    const listClasses = useListStyles();
    const bottomClasses = useBottomStyles();

    // form data
    const { data, setValue, setError, clearError } = useForm(formContext);
    const selectedAsset = data.asset.value;
    const collateral = FixedU128.fromNatural(data.collateral.value);
    const borrow = FixedU128.fromNatural(data.borrow.value);

    const assetName = getAssetName(selectedAsset);
    const stableCoinAssetName = getAssetName(STABLE_COIN);
    const vault = useSelector(specVaultSelector(selectedAsset));
    const balance = useSelector(specBalanceSelector(selectedAsset));
    const collateralPrice = useSelector(specPriceSelector(selectedAsset));

    if (!vault) {
        return null;
    }

    const maxBorrowd = calcCanGenerater(
        collateralToStableCoin(collateral, collateralPrice),
        FixedU128.fromNatural(0),
        vault.requiredCollateralRatio,
    );

    const collateralRatio = calcCollateralRatio(collateralToStableCoin(collateral, collateralPrice), borrow);

    const handleNextBtnClick = () => {
        // ensure collateral is not empty
        if (!collateral) {
            setError('collateral', 'collateral should not be zero');
            return false;
        }

        // ensure required collateral ratio
        if (vault.requiredCollateralRatio.isGreaterThan(collateralRatio)) {
            return false;
        }

        onNext();
    };

    const handleCollateralInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.currentTarget.value);

        if (value < 0) {
            setError('collateral', 'can not be zero');
            return false;
        }

        if (FixedU128.fromNatural(value).isGreaterThan(balance)) {
            setError('collateral', 'larger');
            return false;
        }

        clearError('collateral');
        setValue('collateral', value);
    };

    const handleBorrowInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.currentTarget.value);
        if (value < 0) {
            setError('borrow', 'can not be zero');
            return false;
        }
        if (FixedU128.fromNatural(value).isGreaterThan(maxBorrowd)) {
            setError('borrow', 'larger than maxto borrow');
        }
        setValue('borrow', value);
    };

    return (
        <Paper square={true} elevation={1} classes={cardClasses}>
            <Grid container>
                <Grid item xs={8}>
                    <Typography className={inputClasses.label}>
                        {t('How much {{asset}} would you deposit as collateral?', {
                            asset: assetName,
                        })}
                    </Typography>
                    <TextField
                        type="number"
                        className={inputClasses.root}
                        error={!!data.collateral.error}
                        helperText={
                            <>
                                <span style={{ marginRight: 30 }}>{t('Max to Lock')}</span>
                                <span>{formatBalance(balance, assetName)}</span>
                            </>
                        }
                        InputProps={{
                            value: collateral,
                            endAdornment: <InputAdornment position="end">{assetName}</InputAdornment>,
                            onChange: handleCollateralInput,
                        }}
                        FormHelperTextProps={{
                            classes: { root: inputClasses.helper },
                        }}
                    />
                    <Typography className={inputClasses.label}>
                        {t('How much aUSD would you like to borrow?')}
                    </Typography>
                    <TextField
                        type="number"
                        className={inputClasses.root}
                        error={!!data.borrow.erro}
                        helperText={
                            <>
                                <span style={{ marginRight: 30 }}>{t('Max available to borrow')}</span>
                                <span>{formatBalance(maxBorrowd, stableCoinAssetName)}</span>
                            </>
                        }
                        InputProps={{
                            value: borrow,
                            endAdornment: <InputAdornment position="end">{'aUSD'}</InputAdornment>,
                            onChange: handleBorrowInput,
                        }}
                        FormHelperTextProps={{
                            classes: { root: inputClasses.helper },
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    {vault && (
                        <List classes={{ root: listClasses.root }} disablePadding>
                            <InfoListItem name={t('Collateralization')} value={assetName} />
                            <InfoListItem name={t('Collateralization Ratio')} value={formatRatio(collateralRatio)} />
                            <InfoListItem
                                name={t('{{asset}} Price', { asset: assetName })}
                                value={formatPrice(collateralPrice, '$')}
                            />
                            <InfoListItem
                                name={t('Interest Rate')}
                                value={formatRatio(calcStableFee(vault.stabilityFee))}
                            />
                            <InfoListItem
                                name={t('Liquidation Price')}
                                value={formatPrice(
                                    calcLiquidationPrice(borrow, vault.requiredCollateralRatio, collateral),
                                    '$',
                                )}
                            />
                            <InfoListItem name={t('Liquidation Ratio')} value={formatRatio(vault.liquidationRatio)} />
                            <InfoListItem
                                name={t('Liquidation Penalty')}
                                value={formatRatio(vault.liquidationPenalty)}
                            />
                        </List>
                    )}
                </Grid>
            </Grid>
            <Grid container className={bottomClasses.root} justify="space-between">
                <Typography className={bottomClasses.note}>{t('ADD_VAULT_GENERATE_STABLE_COIN_NOTE')}</Typography>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button className={bottomClasses.linkBtn} onClick={onCancel}>
                                {t('Cancel')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={onPrev}>
                                {t('Previous')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleNextBtnClick}>
                                {t('Next')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Component;
