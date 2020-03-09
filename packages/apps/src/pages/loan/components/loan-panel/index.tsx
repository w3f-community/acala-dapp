import React, { ReactNode, FC } from 'react';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import { useSelector } from 'react-redux';
import { specCdpTypeSelector, specPriceSelector, constantsSelector } from '@honzon-platform/apps/store/chain/selectors';
import { STABLE_COIN } from '@honzon-platform/apps/config';
import { specUserLoanSelector } from '@honzon-platform/apps/store/loan/selectors';
import {
    calcCollateralRatio,
    collateralToUSD,
    debitToUSD,
    calcLiquidationPrice,
    calcStableFee,
} from '@honzon-platform/apps/utils/loan';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import useMobileMatch from '@honzon-platform/apps/hooks/mobile-match';
import Card from '@honzon-platform/apps/components/card';
import Formatter from '@honzon-platform/apps/components/formatter';

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
    const getStatus = () => {
        if (
            currentCollateralRatio.isLessThan(cdpType.requiredCollateralRatio) &&
            currentCollateralRatio.isGreaterThan(cdpType.liquidationRatio)
        ) {
            return 'error';
        }
        if (currentCollateralRatio.isLessThan(cdpType.requiredCollateralRatio.add(FixedU128.fromNatural(0.2)))) {
            return 'warning';
        }
        return 'primary';
    };
    const liquidationPrice = calcLiquidationPrice(
        loan.collateral,
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
                            <Formatter data={liquidationPrice} type="price" prefix={'$'} color={getStatus()} />
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
            <Grid item md={12} lg={6}>
                <Card
                    size="normal"
                    elevation={1}
                    header={<Typography variant="subtitle1">{t('Collateralization')}</Typography>}
                >
                    <List disablePadding>
                        <LoanInfoItem label={t('Current Ratio')}>
                            <Formatter data={currentCollateralRatio} type="ratio" color={getStatus()} />
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
