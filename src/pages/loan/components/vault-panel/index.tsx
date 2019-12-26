import React, { useState } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, Button, Theme } from '@material-ui/core';

import Card from '@/components/card';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import ActionModal, { ActionModalProps } from '../action-modal';
import { useSelector } from 'react-redux';
import { specUserVaultSelector } from '@/store/account/selectors';
import Formatter, { formatBalance } from '@/components/formatter';
import { specVaultSelector, specPriceSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { withStyles } from '@material-ui/styles';
import { createTypography } from '@/theme';
import {
    calcRequiredCollateral,
    debitToUSD,
    debitToStableCoin,
    calcCanGenerater,
    collateralToUSD,
} from '@/utils/vault';
import Skeleton from '@material-ui/lab/Skeleton';
import useMobileMatch from '@/hooks/mobile-match';

interface Props {
    current: number;
}

const Asset = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(30, 32, 500, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const VaultPanel: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const userVault = useSelector(specUserVaultSelector(current));
    const vault = useSelector(specVaultSelector(current));
    const [stableCoinPrice, collateralPrice] = useSelector(specPriceSelector([STABLE_COIN, current]));
    const collateralAssetName = getAssetName(current);
    const stableCoinAssetName = getAssetName(STABLE_COIN);
    const [modalProps, setModalProps] = useState<Omit<ActionModalProps, 'current'>>({ open: false, action: 'any' });
    const match = useMobileMatch('sm');

    const handleCloseModal = () => setModalProps({ open: false, action: 'any' });
    const handleShowPayBack = () => setModalProps({ open: true, action: 'payback' });
    const handleShowGenerate = () => setModalProps({ open: true, action: 'generate' });
    const handleShowDeposit = () => setModalProps({ open: true, action: 'deposit' });
    const handleShowWithdraw = () => setModalProps({ open: true, action: 'withdraw' });

    if (!vault || !userVault) {
        return <Skeleton variant="rect" height={300} />;
    }

    const requiredCollateral = calcRequiredCollateral(
        debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
        vault.requiredCollateralRatio,
        collateralPrice,
    );

    return (
        <Grid container spacing={5} direction={match ? 'column' : 'row'}>
            <ActionModal {...modalProps} onClose={handleCloseModal} current={current} />
            <Grid item sm={12} lg={6}>
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
                                    data={debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice)}
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
                                    number: formatBalance(debitToStableCoin(userVault.debit, vault.debitExchangeRate)),
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
                                            collateralToUSD(userVault.collateral, collateralPrice),
                                            debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
                                            vault.requiredCollateralRatio,
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
            <Grid item sm={12} lg={6}>
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
