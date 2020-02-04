import React from 'react';
import { Grid, Paper, Typography, makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Formatter, { FormatterProps } from '@/components/formatter';
import { useSelector } from 'react-redux';
import { specVaultSelector, specPriceSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { specUserVaultSelector } from '@/store/vault/selectors';
import { calcCollateralRatio, calcStableFee, collateralToUSD, debitToUSD, calcLiquidationPrice } from '@/utils/vault';
import FixedU128 from '@/utils/fixed_u128';
import Skeleton from '@material-ui/lab/Skeleton';
import useMobileMatch from '@/hooks/mobile-match';

const SPaper = withStyles((theme: Theme) => ({
    root: {
        flex: '1 1 auto',
        height: 133,
        padding: '26px 32px',

        '&:last-child': {
            marginRight: 0,
        },

        [theme.breakpoints.down('sm')]: {
            height: 'auto',
            padding: '3px 32px',
        },
        '& .MuiGrid-root': {
            height: '100%',
        },
    },
}))(Paper);

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
        card: {
            minWidth: 154,
            width: '19%',
            marginBottom: '1%',
            flexGrow: 0,
            flexShrink: 0,
            '&:last-child': {
                marginRight: 0,
            },
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
    }),
);

type CardProps = {
    header: string;
    content: FixedU128;
    formatterProps: Omit<FormatterProps, 'data'>;
};

const Card: React.FC<CardProps> = ({ header, content, formatterProps }) => {
    const match = useMobileMatch('sm');
    const classes = useStyles();
    return (
        <SPaper elevation={match ? 0 : 2} square={true} className={classes.card}>
            <Grid
                container
                direction={match ? 'row' : 'column'}
                justify="space-between"
                alignItems="center"
                wrap="nowrap"
            >
                <Typography variant="body2">{header}</Typography>
                <Typography variant="body1">
                    <Formatter data={content} {...formatterProps} />
                </Typography>
            </Grid>
        </SPaper>
    );
};

interface Props {
    current: number;
}

const VaultInfo: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();

    const classes = useStyles();
    const vault = useSelector(specVaultSelector(current));
    const userVault = useSelector(specUserVaultSelector(current));
    const [stableCoinPrice, collateralPrice] = useSelector(specPriceSelector([STABLE_COIN, current]));
    const match = useMobileMatch('sm');

    if (!vault || !userVault) {
        return null;
    }

    const currentCollateralRatio = calcCollateralRatio(
        collateralToUSD(userVault.collateral, collateralPrice),
        debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
    );

    const status = currentCollateralRatio.isGreaterThan(vault.requiredCollateralRatio.add(FixedU128.fromNatural(0.2)));

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
                    {renderInfo()}
                </Paper>
            ) : (
                renderInfo()
            )}
        </Grid>
    );
};

export default VaultInfo;
