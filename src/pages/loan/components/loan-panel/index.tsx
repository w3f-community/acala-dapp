import React, { ReactNode, FC } from 'react';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { useSelector } from 'react-redux';
import { specCdpTypeSelector, specPriceSelector, constantsSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { specUserLoanSelector } from '@/store/loan/selectors';
import { calcCollateralRatio, collateralToUSD, debitToUSD, calcLiquidationPrice, calcStableFee } from '@/utils/loan';
import FixedU128 from '@/utils/fixed_u128';
import useMobileMatch from '@/hooks/mobile-match';
import Card from '@/components/card';
import Formatter from '@/components/formatter';

interface ItemProps {
    label: string;
    children: ReactNode;
}
const LoanInfoItem: FC<ItemProps> = ({ label, children }) => {
    return (
        <ListItem disableGutters>
            <Grid container justify="space-between">
                <Typography variant="body2">{label}</Typography>
                <Typography variant="body2">{children}</Typography>
            </Grid>
        </ListItem>
    );
};

interface Props {
    current: number;
}

const LoanInfo: FC<Props> = ({ current }) => {
    const { t } = useTranslate();

    const cdpType = useSelector(specCdpTypeSelector(current));
    const loan = useSelector(specUserLoanSelector(current));
    const [stableCoinPrice, collateralPrice] = useSelector(specPriceSelector([STABLE_COIN, current]));
    const constants = useSelector(constantsSelector);
    const match = useMobileMatch('sm');

    if (!cdpType || !loan || !constants) {
        return null;
    }

    const currentCollateralRatio = calcCollateralRatio(
        collateralToUSD(loan.collateral, collateralPrice),
        debitToUSD(loan.debit, cdpType.debitExchangeRate, stableCoinPrice),
    );
    const status = currentCollateralRatio.isGreaterThan(
        cdpType.requiredCollateralRatio.add(FixedU128.fromNatural(0.2)),
    );
    const liquidationPrice = calcLiquidationPrice(
        debitToUSD(loan.debit, cdpType.debitExchangeRate, stableCoinPrice),
        cdpType.liquidationRatio,
    );

    return (
        <Grid container direction={match ? 'column' : 'row'} spacing={2} justify="space-between">
            <Grid item md={12} lg={6}>
                <Card
                    size="normal"
                    elevation={1}
                    header={<Typography variant="subtitle1">{t('Liquidation')}</Typography>}
                >
                    <List disablePadding>
                        <LoanInfoItem label={t('Liquidation Price')}>
                            <Formatter
                                data={liquidationPrice}
                                type="price"
                                prefix={'$'}
                                color={status ? 'primary' : 'warning'}
                            />
                        </LoanInfoItem>
                        <LoanInfoItem label={t('Liquidation Ratio')}>
                            <Formatter data={cdpType.liquidationRatio} type="ratio" />
                        </LoanInfoItem>
                        <LoanInfoItem label={t('Liquidation Penalty')}>
                            <Formatter data={cdpType.liquidationPenalty} type="ratio" />
                        </LoanInfoItem>
                    </List>
                </Card>
            </Grid>
            <Grid item md={6} lg={6}>
                <Card
                    size="normal"
                    elevation={1}
                    header={<Typography variant="subtitle1">{t('Collateralization')}</Typography>}
                >
                    <List disablePadding>
                        <LoanInfoItem label={t('Current Ratio')}>
                            <Formatter
                                data={currentCollateralRatio}
                                type="ratio"
                                color={status ? 'primary' : 'warning'}
                            />
                        </LoanInfoItem>
                        <LoanInfoItem label={t('Required Ratio')}>
                            <Formatter data={cdpType.requiredCollateralRatio} type="ratio" />
                        </LoanInfoItem>
                        <LoanInfoItem label={t('Interest Rate')}>
                            <Formatter
                                data={calcStableFee(cdpType.stabilityFee, constants.babe.expectedBlockTime)}
                                type="ratio"
                            />
                        </LoanInfoItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
    );
};

export default LoanInfo;
