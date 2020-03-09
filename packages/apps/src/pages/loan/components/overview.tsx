import React from 'react';
import { Grid, makeStyles, createStyles, Theme, Button } from '@material-ui/core';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import { useSelector } from 'react-redux';
import { pricesFeedSelector, cdpTypeSelector } from '@honzon-platform/apps/store/chain/selectors';
import { STABLE_COIN } from '@honzon-platform/apps/config';
import { loansSelector } from '@honzon-platform/apps/store/loan/selectors';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import useMobileMatch from '@honzon-platform/apps/hooks/mobile-match';
import { DigitalCard } from '@honzon-platform/apps/components/digital-card';
import { getAssetName } from '@honzon-platform/apps/utils';
import Card from '@honzon-platform/apps/components/card';
import {
    calcCollateralRatio,
    collateralToUSD,
    debitToUSD,
    calcRequiredCollateral,
} from '@honzon-platform/apps/utils/loan';
import Formatter from '@honzon-platform/apps/components/formatter';
import { Table } from '@honzon-platform/apps/components/table';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            [theme.breakpoints.down('sm')]: {
                paddingTop: 22,
                paddingBottom: 27,
            },
        },
        item: {
            width: 250,
            padding: '54px 32px',
        },
    }),
);

interface TableDataItem {
    asset: number;
    currentRatio: FixedU128;
    deposited: FixedU128;
    withdraw: FixedU128;
    aUSD: FixedU128;
    [k: string]: any;
}

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
            <Grid spacing={2} container direction={match ? 'column' : 'row'}>
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
            </Grid>
        );
    };

    const loanData = loans.map(loan => {
        const cdp = cdpTypes.find(item => item.asset === loan.asset);
        const price = prices.find(item => item.asset === loan.asset);

        if (!(price && cdp && stableCoinPrice)) {
            return null;
        }

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
        return {
            asset: loan.asset,
            currentRatio: currentCollateralRatio,
            deposited: loan.collateral,
            withdraw: ableToWithdraw,
            aUSD: stableCoinGenerater,
        };
    });

    const tableConfig = [
        {
            renderKey: 'token',
            title: t('Token'),
            render: (_: any, loan: TableDataItem) => getAssetName(loan.asset),
        },
        {
            renderKey: 'currentRatio',
            title: t('Current Ratio'),
            render: (text: FixedU128) => <Formatter data={text} type="ratio" />,
        },
        {
            renderKey: 'deposited',
            title: t('Deposited'),
            render: (text: FixedU128, loan: TableDataItem) => (
                <Formatter data={text} type="balance" suffix={getAssetName(loan.asset)} />
            ),
        },
        {
            renderKey: 'withdraw',
            title: t('Avil. to Withdraw'),
            render: (text: FixedU128, loan: TableDataItem) => (
                <Formatter data={text} type="balance" suffix={getAssetName(loan.asset)} />
            ),
        },
        {
            renderKey: 'aUSD',
            title: t('aUSD'),
            render: (text: FixedU128) => <Formatter data={text} type="balance" suffix={stableCoinName} />,
        },
        {
            renderKey: 'action',
            title: '',
            render: (_: string, loan: TableDataItem) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        onSelect(loan.asset);
                    }}
                >
                    {t('Manage Loan')}
                </Button>
            ),
        },
    ];

    return (
        <>
            {renderContent()}
            <Card size="large" elevation={1} marginTop={2}>
                <Table<TableDataItem> config={tableConfig} data={loanData} />
            </Card>
        </>
    );
};

export default LoanInfo;
