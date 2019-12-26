import React, { ChangeEventHandler, useEffect } from 'react';
import clsx from 'clsx';
import { Grid, Paper, List, ListItem, makeStyles, createStyles, Checkbox, withStyles, Theme } from '@material-ui/core';
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
import { calcCollateralRatio, calcStableFee, USDToDebit, collateralToUSD } from '@/utils/vault';
import { STABLE_COIN } from '@/config';
import { loadingSelector } from '@/store/loading/reducer';
import rootActions from '@/store/actions';
import Bottom from './bottom';

const SPaper = withStyles((theme: Theme) => ({
    root: {
        padding: '66px 35px 60px 29px',
        [theme.breakpoints.down('sm')]: {
            paddingTop: 40,
        },
    },
}))(Paper);

const SListItem = withStyles((theme: Theme) => ({
    root: {
        padding: 0,
        marginBottom: 24,
        ...createTypography(21, 28, 500, 'Roboto', '#424242'),
        [theme.breakpoints.down('sm')]: {
            marginBottom: 24,
            ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
        },
    },
}))(ListItem);

const useStyles = makeStyles((theme: Theme) =>
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
        bottom: {
            marginTop: 63,
            justifyContent: 'flex-end',
            [theme.breakpoints.down('sm')]: {
                marginTop: 40,
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

const Component: React.FC<Props> = ({ onNext, onPrev, onCancel }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    const { data, setValue, setError, clearError } = useForm(formContext);
    const dispatch = useDispatch();

    const selectedAsset = data.asset.value;
    const collateral = FixedU128.fromNatural(data.collateral.value);
    const borrow = FixedU128.fromNatural(data.borrow.value);

    const assetName = getAssetName(selectedAsset);
    const vault = useSelector(specVaultSelector(selectedAsset));
    const balance = useSelector(specBalanceSelector(selectedAsset));
    const [stableCoinPrice, collateralPrice] = useSelector(specPriceSelector([STABLE_COIN, selectedAsset]));
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
                debit: USDToDebit(borrow, vault.debitExchangeRate, stableCoinPrice),
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
                <Grid item xs={12} lg={6}>
                    <List disablePadding>
                        {vault && balance && (
                            <>
                                <VaultInfoItem name={t('Depositing')} value={formatBalance(collateral, assetName)} />
                                <VaultInfoItem name={t('Borrowing/Generating')} value={formatBalance(borrow, 'aUSD')} />
                                <VaultInfoItem
                                    name={t('Collateralization Ratio')}
                                    value={formatRatio(
                                        calcCollateralRatio(collateralToUSD(collateral, collateralPrice), borrow),
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
                        wrap="nowrap"
                    >
                        <Checkbox value={data.agree.value} onChange={handleAgree} />
                        <span>
                            {t('I have read and accepted the ')}
                            <a className={'underline'} href="/">
                                {t('Terms and Conditions')}
                            </a>
                        </span>
                    </Grid>
                </Grid>
            </Grid>
            <Bottom
                nextBtnDisabled={loading}
                onPrev={onPrev}
                onNext={handleNextBtnClick}
                onCancel={onCancel}
                className={classes.bottom}
            />
        </SPaper>
    );
};

export default Component;
