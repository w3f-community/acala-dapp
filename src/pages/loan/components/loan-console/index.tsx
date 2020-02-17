import React, { useState } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, Button, Theme } from '@material-ui/core';

import Card from '@/components/card';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import ActionModal, { ActionModalProps } from '../action-modal';
import { useSelector } from 'react-redux';
import { specUserLoanSelector } from '@/store/loan/selectors';
import Formatter, { formatBalance } from '@/components/formatter';
import { specCdpTypeSelector, specPriceSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { withStyles } from '@material-ui/styles';
import { createTypography } from '@/theme';
import { calcRequiredCollateral, debitToUSD, debitToStableCoin, calcCanGenerater, collateralToUSD } from '@/utils/loan';
import useMobileMatch from '@/hooks/mobile-match';

interface Props {
    current: number;
}

const Title = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(17, 24, 500, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const Asset = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(17, 24, 500, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const SListItemText = withStyles((theme: Theme) => ({
    secondary: {
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
    },
}))(ListItemText);

const SListItem = withStyles((theme: Theme) => ({
    root: {
        alignItems: 'flex-start',
        paddingTop: 0,
        paddingBottom: 8,
        '&:last-child': {
            paddingBottom: 0,
        },
    },
}))(ListItem);

const LoanConsole: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const userLoan = useSelector(specUserLoanSelector(current));
    const cdpType = useSelector(specCdpTypeSelector(current));
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

    if (!cdpType || !userLoan) {
        return null;
    }

    const requiredCollateral = calcRequiredCollateral(
        debitToUSD(userLoan.debit, cdpType.debitExchangeRate, stableCoinPrice),
        cdpType.requiredCollateralRatio,
        collateralPrice,
    );

    return (
        <Grid container spacing={2} direction={match ? 'column' : 'row'}>
            <ActionModal {...modalProps} onClose={handleCloseModal} current={current} />
            <Grid item sm={12} lg={6}>
                <Card
                    size="large"
                    elevation={1}
                    header={
                        <Grid container justify="space-between" alignItems="center">
                            <Title>{t('Borrowed aUSD')}</Title>
                            <Asset>
                                <Formatter
                                    type="price"
                                    data={debitToUSD(userLoan.debit, cdpType.debitExchangeRate, stableCoinPrice)}
                                    prefix="$"
                                    rm={2}
                                />
                            </Asset>
                        </Grid>
                    }
                >
                    <List disablePadding>
                        <SListItem button disableGutters>
                            <SListItemText
                                primary={t('Can Pay Back')}
                                secondary={t('{{number}} {{asset}}', {
                                    number: formatBalance(
                                        debitToStableCoin(userLoan.debit, cdpType.debitExchangeRate),
                                        '',
                                        2,
                                        2,
                                    ),
                                    asset: stableCoinAssetName,
                                })}
                            />
                            <Button variant="contained" color="primary" onClick={handleShowPayBack}>
                                {t('Payback')}
                            </Button>
                        </SListItem>
                        <SListItem button disableGutters>
                            <SListItemText
                                primary={t('Can Generate')}
                                secondary={t('{{number}} {{asset}}', {
                                    number: formatBalance(
                                        calcCanGenerater(
                                            collateralToUSD(userLoan.collateral, collateralPrice),
                                            debitToUSD(userLoan.debit, cdpType.debitExchangeRate, stableCoinPrice),
                                            cdpType.requiredCollateralRatio,
                                            stableCoinPrice,
                                        ),
                                    ),
                                    asset: stableCoinAssetName,
                                })}
                            />
                            <Button variant="contained" color="primary" onClick={handleShowGenerate}>
                                {t('Generate')}
                            </Button>
                        </SListItem>
                    </List>
                </Card>
            </Grid>
            <Grid item sm={12} lg={6}>
                <Card
                    size="large"
                    elevation={1}
                    header={
                        <Grid container justify="space-between" alignItems="center">
                            <Title>{t('Collateral {{asset}}', { asset: collateralAssetName })}</Title>
                            <Asset>
                                <Formatter type="balance" data={userLoan.collateral} suffix={getAssetName(current)} />
                            </Asset>
                        </Grid>
                    }
                >
                    <List disablePadding>
                        <SListItem button disableGutters disableRipple>
                            <SListItemText
                                primary={t('Required for Safety')}
                                secondary={t('{{number}} {{asset}}', {
                                    number: formatBalance(requiredCollateral, '', 2, 2),
                                    asset: collateralAssetName,
                                })}
                            />
                            <Button variant="contained" color="primary" onClick={handleShowDeposit}>
                                {t('Deposit')}
                            </Button>
                        </SListItem>
                        <SListItem button disableGutters disableRipple>
                            <SListItemText
                                primary={t('Able to Withdraw')}
                                secondary={t('{{number}} {{asset}}', {
                                    number: formatBalance(userLoan.collateral.sub(requiredCollateral)),
                                    asset: collateralAssetName,
                                })}
                            />
                            <Button variant="contained" color="primary" onClick={handleShowWithdraw}>
                                {t('Withdraw')}
                            </Button>
                        </SListItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
    );
};

export default LoanConsole;
