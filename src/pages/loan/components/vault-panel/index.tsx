import React, { useState } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, Button, Box, Theme } from '@material-ui/core';

import Card from '@/components/card';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import ActionModal, { ActionModalProps } from '../action-modal';
import { useSelector } from 'react-redux';
import { specUserVaultSelector } from '@/store/user/selectors';
import Formatter, { formatBalance } from '@/components/formatter';
import { specVaultSelector, specPriceSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { withStyles } from '@material-ui/styles';
import { createTypography } from '@/theme';
import { calcRequiredCollateral, debitToStableCoin, calcCanGenerater } from '@/utils/vault';

interface Props {
    current: number;
}

const Asset = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(30, 32, 600, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const VaultPanel: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const userVault = useSelector(specUserVaultSelector(current));
    const vault = useSelector(specVaultSelector(current));
    const collateralPrice = useSelector(specPriceSelector(current));
    const stableCoinPrice = useSelector(specPriceSelector(STABLE_COIN));
    const collateralAssetName = getAssetName(current);
    const stableCoinAssetName = getAssetName(STABLE_COIN);
    const [modalProps, setModalProps] = useState<Omit<ActionModalProps, 'current'>>({ open: false, action: 'any' });

    const handleCloseModal = () => setModalProps({ open: false, action: 'any' });
    const handleShowPayBack = () => setModalProps({ open: true, action: 'payback' });
    const handleShowGenerate = () => setModalProps({ open: true, action: 'generate' });
    const handleShowDeposit = () => setModalProps({ open: true, action: 'deposit' });
    const handleShowWithdraw = () => setModalProps({ open: true, action: 'withdraw' });

    if (!vault || !userVault) {
        return null;
    }

    const requiredCollateral = calcRequiredCollateral(
        userVault.debit,
        vault.debitExchangeRate,
        vault.requiredCollateralRatio,
        collateralPrice,
        stableCoinPrice,
    );

    return (
        <Grid container spacing={5}>
            <ActionModal {...modalProps} onClose={handleCloseModal} current={current} />
            <Grid item xs={6}>
                <Card
                    size="large"
                    elevation={1}
                    contentPadding={4}
                    header={
                        <Grid container justify="space-between" alignItems="center">
                            <Typography variant="subtitle1">{t('Borrowed aUSD')}</Typography>
                            <Asset>
                                <Formatter
                                    type="price"
                                    data={debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice)}
                                    prefix="$"
                                />
                            </Asset>
                        </Grid>
                    }
                >
                    <List disablePadding>
                        <ListItem disableGutters>
                            <ListItemText
                                primary={t('Can Pay Back')}
                                secondary={t('{{number}} {{asset}}', {
                                    number: formatBalance(
                                        debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
                                    ),
                                    asset: stableCoinAssetName,
                                })}
                            />
                            <Button variant="contained" color="primary" onClick={handleShowPayBack}>
                                {t('Payback')}
                            </Button>
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemText
                                primary={t('Can Generate')}
                                secondary={t('{{number}} {{asset}}', {
                                    number: formatBalance(
                                        calcCanGenerater(
                                            userVault.collateral,
                                            userVault.debit,
                                            vault.requiredCollateralRatio,
                                            vault.debitExchangeRate,
                                            collateralPrice,
                                            stableCoinPrice,
                                        ),
                                    ),
                                    asset: stableCoinAssetName,
                                })}
                            />
                            <Button variant="contained" color="primary" onClick={handleShowGenerate}>
                                {t('Generate')}
                            </Button>
                        </ListItem>
                    </List>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card
                    size="large"
                    elevation={1}
                    contentPadding={4}
                    header={
                        <Grid container justify="space-between" alignItems="center">
                            <Typography variant="subtitle1">
                                {t('Collateral {{asset}}', { asset: collateralAssetName })}
                            </Typography>
                            <Asset>
                                <Formatter type="balance" data={userVault.collateral} suffix={getAssetName(current)} />
                            </Asset>
                        </Grid>
                    }
                >
                    <List disablePadding>
                        <ListItem disableGutters>
                            <ListItemText
                                primary={t('Required for Safety')}
                                secondary={t('{{number}} {{asset}}', {
                                    number: formatBalance(requiredCollateral),
                                    asset: collateralAssetName,
                                })}
                            />
                            <Button variant="contained" color="primary" onClick={handleShowDeposit}>
                                {t('Deposit')}
                            </Button>
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemText
                                primary={t('Able to Withdraw')}
                                secondary={t('{{number}} {{asset}}', {
                                    number: formatBalance(userVault.collateral.sub(requiredCollateral)),
                                    asset: collateralAssetName,
                                })}
                            />
                            <Button variant="contained" color="primary" onClick={handleShowWithdraw}>
                                {t('Withdraw')}
                            </Button>
                        </ListItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
    );
};

export default VaultPanel;
