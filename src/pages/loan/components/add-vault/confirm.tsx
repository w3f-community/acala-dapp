import React, { ChangeEventHandler, useEffect } from 'react';
import { Grid, Button, Paper, List, ListItem, makeStyles, createStyles, Checkbox, withStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import { formatRatio, formatBalance } from '@/components/formatter';
import { useForm } from '@/hooks/form';
import { specVaultSelector, specPriceSelector } from '@/store/chain/selectors';
import { specBalanceSelector } from '@/store/account/selectors';
import { getAssetName } from '@/utils';
import actions from '@/store/actions';
import { formContext } from './context';
import { statusSelector } from '@/store/vault/selectors';
import FixedU128 from '@/utils/fixed_u128';
import { calcCollateralRatio, calcStableFee, stableCoinToDebit, collateralToStableCoin } from '@/utils/vault';
import { STABLE_COIN } from '@/config';
import { loadingSelector } from '@/store/loading/reducer';
import rootActions from '@/store/actions';
import clsx from 'clsx';

const SPaper = withStyles(() => ({
    root: { padding: '66px 35px 60px 29px' },
}))(Paper);

const SListItem = withStyles(() => ({
    root: {
        marginBottom: 24,
        ...createTypography(21, 28, 600, 'Roboto', '#424242'),
    },
}))(ListItem);

const useStyles = makeStyles(() =>
    createStyles({
        item: {
            marginBottom: 24,
        },
        protocol: {
            marginTop: 30,
            ...createTypography(14, 19, 400, 'Roboto', '#757575'),
            '& .underline': {
                textDecoration: 'underline',
                cursor: 'pointer',
            },
        },
        error: {
            color: 'red',
        },
    }),
);

const useBottomStyles = makeStyles(() =>
    createStyles({
        root: {
            paddingTop: 66,
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

const VaultInfoItem: React.FC<{ name: string; value: string }> = ({ name, value }) => {
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
    onCancel: () => void;
    onPrev: () => void;
}

const Component: React.FC<Props> = ({ onNext, onPrev }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    const bottomClasses = useBottomStyles();
    const { data, setValue, setError, clearError } = useForm(formContext);
    const dispatch = useDispatch();

    const selectedAsset = data.asset.value;
    const collateral = FixedU128.fromNatural(data.collateral.value);
    const borrow = FixedU128.fromNatural(data.borrow.value);

    const assetName = getAssetName(selectedAsset);
    const vault = useSelector(specVaultSelector(selectedAsset));
    const balance = useSelector(specBalanceSelector(selectedAsset));
    const collateralPrice = useSelector(specPriceSelector(selectedAsset));
    const stableCoinPrice = useSelector(specPriceSelector(STABLE_COIN));
    const updateVaultStatus = useSelector(statusSelector('updateVault'));
    const loading = useSelector(loadingSelector(rootActions.vault.UPDATE_VAULT));

    const handleNextBtnClick = () => {
        if (!data.agree.value) {
            setError('agree', 'need agree');
            return false;
        }

        if (!vault) {
            return false;
        }

        dispatch(
            actions.vault.updateVault.request({
                asset: selectedAsset,
                collateral: collateral,
                debit: stableCoinToDebit(borrow, vault.debitExchangeRate, stableCoinPrice),
            }),
        );
    };

    useEffect(() => {
        if (updateVaultStatus === 'success') {
            dispatch(actions.vault.reset());
            onNext();
        }
    }, [updateVaultStatus, dispatch, onNext]);

    const handleAgree: ChangeEventHandler<HTMLInputElement> = e => {
        const result = e.target.checked;
        setValue('agree', result);
        if (result) {
            clearError('agree');
        }
    };

    if (!vault) {
        return null;
    }

    return (
        <SPaper square={true} elevation={1}>
            <Grid container justify="center">
                <Grid item xs={6}>
                    <List disablePadding>
                        {vault && balance && (
                            <>
                                <VaultInfoItem name={t('Depositing')} value={formatBalance(collateral, assetName)} />
                                <VaultInfoItem name={t('Borrowing/Generating')} value={formatBalance(borrow, 'aUSD')} />
                                <VaultInfoItem
                                    name={t('Collateralization Ratio')}
                                    value={formatRatio(
                                        calcCollateralRatio(
                                            collateralToStableCoin(collateral, collateralPrice),
                                            borrow,
                                        ),
                                    )}
                                />
                                <VaultInfoItem
                                    name={t('Liquidation Ratio')}
                                    value={formatRatio(vault.liquidationRatio)}
                                />
                                <VaultInfoItem
                                    name={t('Liquidation Fee')}
                                    value={formatRatio(vault.liquidationPenalty)}
                                />
                                <VaultInfoItem
                                    name={t('Stability Fee/Interest Rate')}
                                    value={formatRatio(calcStableFee(vault.stabilityFee))}
                                />
                            </>
                        )}
                    </List>
                    <Grid
                        container
                        className={clsx(classes.protocol, {
                            [classes.error]: data.agree.error,
                        })}
                        alignItems="center"
                    >
                        <Checkbox value={data.agree.value} onChange={handleAgree} />
                        <span>
                            {t('I have read and accepted the ')}
                            <a className={'underline'}>{t('Terms and Conditions')}</a>
                        </span>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container className={bottomClasses.root} justify="flex-end">
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button className={bottomClasses.linkBtn}>{t('Cancel')}</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={onPrev} disabled={loading}>
                                {t('Previous')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNextBtnClick}
                                disabled={updateVaultStatus === 'pending'}
                            >
                                {t('Next')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </SPaper>
    );
};

export default Component;
