import React, { useCallback, useEffect } from 'react';
import { Grid, Button, Paper, List, ListItem, makeStyles, createStyles, Radio, withStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import { formatRatio, formatBalance } from '@/components/formatter';
import { useForm } from '@/hooks/form';
import { specVaultSelector } from '@/store/chain/selectors';
import { specBalanceSelector } from '@/store/user/selectors';
import { getAssetName, getBalance } from '@/utils';
import actions from '@/store/actions';
import { formContext } from './context';
import { statusSelector } from '@/store/vault/selectors';

const Card = withStyles(() => ({
    root: { padding: '66px 35px 60px 29px' },
}))(Paper);

const StyledListItem = withStyles(() => ({
    root: {
        marginBottom: 24,
        ...createTypography(21, 28, 600, 'Roboto', '#424242'),
    },
}))(ListItem);

const useListStyles = makeStyles(() =>
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
        <StyledListItem button>
            <Grid container justify="space-between">
                <span>{name}</span>
                <span>{value}</span>
            </Grid>
        </StyledListItem>
    );
};

interface Props {
    onNext: () => void;
    onCancel: () => void;
    onPrev: () => void;
}

const Component: React.FC<Props> = ({ onNext, onPrev }) => {
    const { t } = useTranslate();
    const listClasses = useListStyles();
    const bottomClasses = useBottomStyles();
    const { data } = useForm(formContext);
    const dispatch = useDispatch();
    const selectedAsset = data.asset.value;
    const collateral = getBalance(data.collateral.value);
    const borrow = getBalance(data.borrow.value);
    const assetName = getAssetName(selectedAsset);
    const vault = useSelector(specVaultSelector(selectedAsset));
    const balance = useSelector(specBalanceSelector(selectedAsset));
    const updateVaultStatus = useSelector(statusSelector('updateVault'));
    const handleNextBtnClick = () => {
        dispatch(
            actions.vault.updateVault.request({
                collateral,
                debit: borrow,
                asset: selectedAsset,
            }),
        );
    };

    useEffect(() => {
        if (updateVaultStatus === 'success') {
            dispatch(actions.vault.reset());
            onNext();
        }
    }, [updateVaultStatus]);

    return (
        <Card square={true} elevation={1}>
            <Grid container justify="center">
                <Grid item xs={6}>
                    <List disablePadding>
                        {vault && balance && (
                            <>
                                <VaultInfoItem name={t('Depositing')} value={formatBalance(collateral, assetName)} />
                                <VaultInfoItem name={t('Borrowing/Generating')} value={formatBalance(borrow, 'aUSD')} />
                                <VaultInfoItem name={t('Collateralization Ratio')} value={formatRatio(1.75)} />
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
                                    value={formatRatio(vault.stabilityFee)}
                                />
                            </>
                        )}
                    </List>
                    <Grid container className={listClasses.protocol} alignItems="center">
                        <Radio />
                        <span>{t('I have read and accepted the ')}</span>
                        <a className={'underline'}>{t('Terms and Conditions')}</a>
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
                            <Button variant="contained" color="secondary" onClick={onPrev}>
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
        </Card>
    );
};

export default Component;
