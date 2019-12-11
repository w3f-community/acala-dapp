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
import { getAssetName, getBalance } from '@/utils';
import { useSelector } from 'react-redux';
import { specVaultSelector } from '@/store/chain/selectors';
import { useForm } from '@/hooks/form';
import { specBalanceSelector } from '@/store/user/selectors';

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
        item: {
            ...createTypography(15, 22, 600, 'Roboto', '#424242'),
        },
    }),
);

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

const InfoListItem: React.FC<{ name: string; value: string; className: string }> = ({ name, value, className }) => {
    return (
        <ListItem classes={{ root: className }}>
            <Grid container justify="space-between">
                <span>{name}</span>
                <span>{value}</span>
            </Grid>
        </ListItem>
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
    const { data, setValue, setError, clearError } = useForm(formContext);
    const selectedAsset = data.asset.value;
    const collateral = data.collateral.value || '';
    const borrow = data.borrow.value || '';
    const vault = useSelector(specVaultSelector(selectedAsset));
    const balance = useSelector(specBalanceSelector(selectedAsset));
    const assetName = getAssetName(selectedAsset);

    const handleNextBtnClick = () => {
        if (!collateral) {
            setError('collateral', 'collateral should not be zero');
            return false;
        }
        onNext();
    };

    const handleCollateralInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.currentTarget.value);

        if (value < 0) {
            setError('collateral', 'zero');
            return false;
        }

        if (getBalance(value) > balance) {
            setError('collateral', 'larger');
            return false;
        }

        clearError('collateral');
        setValue('collateral', value);
    };

    const handleBorrowInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.currentTarget.value);
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
                        helperText={
                            <>
                                <span style={{ marginRight: 30 }}>{t('Max available to borrow')}</span>
                                <span>{t('{{number}} {{asset}}', { number: 120, asset: 'aUSD' })}</span>
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
                            <InfoListItem
                                name={t('Collateralization')}
                                value={formatRatio(vault.asset)}
                                className={listClasses.item}
                            />
                            <InfoListItem
                                name={t('Collateral Ratio')}
                                value={formatRatio(vault.liquidationRatio)}
                                className={listClasses.item}
                            />
                            <InfoListItem
                                name={t('{{asset}} Price', { asset: assetName })}
                                value={formatRatio(vault.asset)}
                                className={listClasses.item}
                            />
                            <InfoListItem
                                name={t('Interest Rate')}
                                value={formatRatio(vault.stabilityFee)}
                                className={listClasses.item}
                            />
                            <InfoListItem
                                name={t('Liquidation Ratio')}
                                value={formatRatio(vault.liquidationRatio)}
                                className={listClasses.item}
                            />
                            <InfoListItem
                                name={t('Liquidation Penalty')}
                                value={formatRatio(vault.liquidationPenalty)}
                                className={listClasses.item}
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
