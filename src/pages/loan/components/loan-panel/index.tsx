import React from 'react';
import { Grid, Paper, makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { useSelector } from 'react-redux';
import { specCdpTypeSelector, specPriceSelector, constantsSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { specUserLoanSelector } from '@/store/loan/selectors';
import { calcCollateralRatio, calcStableFee, collateralToUSD, debitToUSD, calcLiquidationPrice } from '@/utils/loan';
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

const LoanInfo: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();

    const classes = useStyles();
    const loan = useSelector(specCdpTypeSelector(current));
    const userLoan = useSelector(specUserLoanSelector(current));
    const [stableCoinPrice, collateralPrice] = useSelector(specPriceSelector([STABLE_COIN, current]));
    const constants = useSelector(constantsSelector);
    const match = useMobileMatch('sm');

    if (!loan || !userLoan || !constants) {
        return null;
    }

    const currentCollateralRatio = calcCollateralRatio(
        collateralToUSD(userLoan.collateral, collateralPrice),
        debitToUSD(userLoan.debit, loan.debitExchangeRate, stableCoinPrice),
    );

    const status = currentCollateralRatio.isGreaterThan(loan.requiredCollateralRatio.add(FixedU128.fromNatural(0.2)));

    const renderContent = () => {
        return (
            <>
                <Card
                    header={t('Interest Rate')}
                    content={calcStableFee(loan.stabilityFee, constants.babe.expectedBlockTime)}
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
                    content={loan.liquidationRatio}
                    formatterProps={{ type: 'ratio' }}
                />
                <Card
                    header={t('Liquidation Price')}
                    content={calcLiquidationPrice(
                        debitToUSD(userLoan.debit, loan.debitExchangeRate, stableCoinPrice),
                        loan.liquidationRatio,
                    )}
                    formatterProps={{ type: 'price', prefix: '$' }}
                />
                <Card
                    header={t('Liquidation Penalty')}
                    content={loan.liquidationPenalty}
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

export default LoanInfo;
