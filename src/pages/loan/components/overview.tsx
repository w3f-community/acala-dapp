import React from 'react';
import {
    Grid,
    Paper,
    makeStyles,
    createStyles,
    Theme,
    withStyles,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Button,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { useSelector } from 'react-redux';
import { pricesFeedSelector, cdpTypeSelector } from '@/store/chain/selectors';
import { STABLE_COIN } from '@/config';
import { loansSelector } from '@/store/loan/selectors';
import FixedU128 from '@/utils/fixed_u128';
import useMobileMatch from '@/hooks/mobile-match';
import { DigitalCard } from '@/components/digital-card';
import { getAssetName } from '@/utils';
import Card from '@/components/card';
import { createTypography } from '@/theme';
import { calcCollateralRatio, collateralToUSD, debitToUSD, calcRequiredCollateral } from '@/utils/loan';
import Formatter from '@/components/formatter';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            [theme.breakpoints.down('sm')]: {
                paddingTop: 22,
                paddingBottom: 27,
            },
        },
        item: {
            minWidth: 260,
            padding: '62px 32px',
        },
    }),
);

const StyledBodyCell = withStyles((theme: Theme) => ({
    root: {
        borderBottom: 'none',
        color: theme.palette.text.secondary,
    },
}))(TableCell);

const StyledHeaderCell = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.common.black,
        ...createTypography(15, 22, 500, 'Roboto'),
    },
}))(TableCell);

interface Props {
    onSelect: (asset: number) => void;
}

const LoanInfo: React.FC<Props> = ({ onSelect }) => {
    const { t } = useTranslate();

    const classes = useStyles();
    const cdpTypes = useSelector(cdpTypeSelector);
    const loans = useSelector(loansSelector);
    const prices = useSelector(pricesFeedSelector);
    const match = useMobileMatch('sm');
    const stableCoinPrice = prices.find(item => item.asset === STABLE_COIN);
    const stableCoinName = getAssetName(STABLE_COIN);

    // calcault data
    const totalCollateralLocked = loans.reduce((acc, cur) => {
        const price = prices.find(item => item.asset === cur.asset);
        return price ? acc.add(cur.collateral.mul(price.price)) : acc;
    }, FixedU128.fromNatural(0));
    const totalDebit = loans.reduce((acc, cur) => {
        const cdp = cdpTypes.find(item => item.asset === cur.asset);
        return cdp ? acc.add(cur.debit.mul(cdp.debitExchangeRate)) : acc;
    }, FixedU128.fromNatural(0));

    const renderContent = () => {
        return (
            <>
                <Grid item>
                    <DigitalCard
                        elevation={1}
                        className={classes.item}
                        header={t('Total Collateral Locked')}
                        content={totalCollateralLocked}
                        formatterProps={{ type: 'price', prefix: '$', color: 'primary' }}
                    />
                </Grid>
                <Grid item>
                    <DigitalCard
                        elevation={1}
                        className={classes.item}
                        header={t('Total aUSD Debit')}
                        content={totalDebit}
                        formatterProps={{ type: 'balance', suffix: stableCoinName, color: 'primary' }}
                    />
                </Grid>
            </>
        );
    };

    const renderTable = () =>
        loans.map(loan => {
            const cdp = cdpTypes.find(item => item.asset === loan.asset);
            const price = prices.find(item => item.asset === loan.asset);

            if (!(price && cdp && stableCoinPrice)) {
                return null;
            }

            const assetName = getAssetName(loan.asset);
            const currentCollateralRatio = calcCollateralRatio(
                collateralToUSD(loan.collateral, price.price),
                debitToUSD(loan.debit, cdp.debitExchangeRate, stableCoinPrice.price),
            );
            const requiredCollateral = calcRequiredCollateral(
                debitToUSD(loan.debit, cdp.debitExchangeRate, stableCoinPrice.price),
                cdp.requiredCollateralRatio,
                price.price,
            );
            const ableToWithdraw = loan.collateral.sub(requiredCollateral);
            const stableCoinGenerater = loan.debit.mul(cdp.debitExchangeRate);
            return (
                <TableRow key={`overview-${loan.asset}`}>
                    <StyledBodyCell>{getAssetName(loan.asset)}</StyledBodyCell>
                    <StyledBodyCell>
                        <Formatter type="ratio" data={currentCollateralRatio} />
                    </StyledBodyCell>
                    <StyledBodyCell>
                        <Formatter type="balance" data={loan.collateral} suffix={assetName} />
                    </StyledBodyCell>
                    <StyledBodyCell>
                        <Formatter type="balance" data={ableToWithdraw} suffix={assetName} />
                    </StyledBodyCell>
                    <StyledBodyCell>
                        <Formatter type="balance" data={stableCoinGenerater} suffix={stableCoinName} />
                    </StyledBodyCell>
                    <StyledBodyCell>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                onSelect(loan.asset);
                            }}
                        >
                            {t('Manage Loan')}
                        </Button>
                    </StyledBodyCell>
                </TableRow>
            );
        });

    return (
        <>
            <Grid spacing={3} container direction={match ? 'column' : 'row'}>
                {renderContent()}
            </Grid>
            <Card size="large" elevation={1} marginTop={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledHeaderCell>{t('Token')}</StyledHeaderCell>
                            <StyledHeaderCell>{t('Current Ratio')}</StyledHeaderCell>
                            <StyledHeaderCell>{t('Deposited')}</StyledHeaderCell>
                            <StyledHeaderCell>{t('Avil. to Withdraw')}</StyledHeaderCell>
                            <StyledHeaderCell>{t('StableCoin')}</StyledHeaderCell>
                            <StyledHeaderCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderTable()}</TableBody>
                </Table>
            </Card>
        </>
    );
};

export default LoanInfo;
