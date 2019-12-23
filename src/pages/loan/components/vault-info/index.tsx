import React from 'react';
import { Grid, Box, Paper, Typography, makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Formatter, { FormatterProps } from '@/components/formatter';
import { useSelector } from 'react-redux';
import { vaultsSelector, specVaultSelector, specPriceSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { specUserVaultSelector, accountVaultsSelector } from '@/store/account/selectors';
import {
    calcCollateralRatio,
    calcStableFee,
    collateralToStableCoin,
    debitToStableCoin,
    calcLiquidationPrice,
} from '@/utils/vault';
import FixedU128 from '@/utils/fixed_u128';
import Skeleton from '@material-ui/lab/Skeleton';
import useMobileMatch from '@/hooks/mobile-match';

const SPaper = withStyles((theme: Theme) => ({
    root: {
        height: 133,
        padding: '26px 32px',

        [theme.breakpoints.down('sm')]: {
            height: 'auto',
            padding: '3px 32px',
        },
        '& .MuiGrid-root': {
            height: '100%',
        },
    },
}))(Paper);

type CardProps = {
    header: string;
    content: FixedU128;
    formatterProps: Omit<FormatterProps, 'data'>;
};

const Card: React.FC<CardProps> = ({ header, content, formatterProps }) => {
    const match = useMobileMatch('sm');

    return (
        <Grid item xs>
            <SPaper elevation={match ? 0 : 2} square={true}>
                <Grid container direction={match ? 'row' : 'column'} justify="space-between" alignItems="center">
                    <Typography variant="body2" style={{ whiteSpace: 'nowrap' }}>
                        {header}
                    </Typography>
                    <Typography variant="body1">
                        <Formatter data={content} {...formatterProps} />
                    </Typography>
                </Grid>
            </SPaper>
        </Grid>
    );
};

interface Props {
    current: number;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            [theme.breakpoints.down('sm')]: {
                paddingTop: 22,
                paddingBottom: 27,
            },
        },
    }),
);

const VaultInfo: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();

    const classes = useStyles();
    const vault = useSelector(specVaultSelector(current));
    const userVault = useSelector(specUserVaultSelector(current));
    const collateralPrice = useSelector(specPriceSelector(current));
    const stableCoinPrice = useSelector(specPriceSelector(STABLE_COIN));
    const match = useMobileMatch('sm');

    if (!vault || !userVault) {
        return <Skeleton variant="rect" height={240} />;
    }

    const renderInfo = () => {
        return (
            <>
                <Card
                    header={t('Interest Rate')}
                    content={calcStableFee(vault.stabilityFee)}
                    formatterProps={{ type: 'ratio' }}
                />
                <Card
                    header={t('Current Collateral Ratio')}
                    content={calcCollateralRatio(
                        collateralToStableCoin(userVault.collateral, collateralPrice),
                        debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
                    )}
                    formatterProps={{ type: 'ratio' }}
                />
                <Card
                    header={t('Liquidation Ratio')}
                    content={vault.liquidationRatio}
                    formatterProps={{ type: 'ratio' }}
                />
                <Card
                    header={t('Liquidation Price')}
                    content={calcLiquidationPrice(
                        debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
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
        <Grid container spacing={match ? 0 : 3} direction={match ? 'column' : 'row'}>
            {match ? (
                <Paper elevation={match ? 2 : 0} square={true} className={classes.paper}>
                    {renderInfo()}
                </Paper>
            ) : (
                renderInfo()
            )}
        </Grid>
    );
};

export default VaultInfo;
