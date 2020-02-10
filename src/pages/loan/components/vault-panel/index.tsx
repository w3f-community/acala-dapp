import React from 'react';
import { Grid, Paper, makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { useSelector } from 'react-redux';
import { specCdpTypeSelector, specPriceSelector, constantsSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { specUserVaultSelector } from '@/store/vault/selectors';
import { calcCollateralRatio, calcStableFee, collateralToUSD, debitToUSD, calcLiquidationPrice } from '@/utils/vault';
import FixedU128 from '@/utils/fixed_u128';
import useMobileMatch from '@/hooks/mobile-match';
import { DigitalCard as Card } from '@/components/digital-card';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            marginBottom: '-1%',
        },
        paper: {
            [theme.breakpoints.down('sm')]: {
                paddingTop: 22,
                paddingBottom: 27,
            },
        },
    }),
);

interface Props {
    current: number;
}

const VaultInfo: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();

    const classes = useStyles();
    const vault = useSelector(specCdpTypeSelector(current));
    const userVault = useSelector(specUserVaultSelector(current));
    const [stableCoinPrice, collateralPrice] = useSelector(specPriceSelector([STABLE_COIN, current]));
    const constants = useSelector(constantsSelector);
    const match = useMobileMatch('sm');

    if (!vault || !userVault || !constants) {
        return null;
    }

    const currentCollateralRatio = calcCollateralRatio(
        collateralToUSD(userVault.collateral, collateralPrice),
        debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
    );

    const status = currentCollateralRatio.isGreaterThan(vault.requiredCollateralRatio.add(FixedU128.fromNatural(0.2)));

    const renderContent = () => {
        return (
            <>
                <Card
                    header={t('Interest Rate')}
                    content={calcStableFee(vault.stabilityFee, constants.babe.expectedBlockTime)}
                    formatterProps={{ type: 'ratio' }}
                />
                <Card
                    header={t('Current Collateral Ratio')}
                    content={currentCollateralRatio}
                    formatterProps={{
                        type: 'ratio',
                        color: status ? 'primary' : 'warning',
                    }}
                />
                <Card
                    header={t('Liquidation Ratio')}
                    content={vault.liquidationRatio}
                    formatterProps={{ type: 'ratio' }}
                />
                <Card
                    header={t('Liquidation Price')}
                    content={calcLiquidationPrice(
                        debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
                        vault.requiredCollateralRatio,
                        userVault.collateral,
                    )}
                    formatterProps={{ type: 'price', prefix: '$' }}
                />
                <Card
                    header={t('Liquidation Penalty')}
                    content={vault.liquidationPenalty}
                    formatterProps={{ type: 'ratio' }}
                />
            </>
        );
    };

    return (
        <Grid container direction={match ? 'column' : 'row'} justify="space-between" className={classes.container}>
            {match ? (
                <Paper elevation={match ? 2 : 0} square={true} className={classes.paper}>
                    {renderContent()}
                </Paper>
            ) : (
                renderContent()
            )}
        </Grid>
    );
};

export default VaultInfo;
