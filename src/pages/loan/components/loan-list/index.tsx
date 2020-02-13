import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, withStyles } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';

import add from '@/assets/add.svg';
import { getAssetName, getAssetIcon } from '@/utils';
import { cdpTypeSelector, pricesFeedSelector } from '@/store/chain/selectors';
import { loansSelector } from '@/store/loan/selectors';
import Formatter from '@/components/formatter';
import clsx from 'clsx';
import { collateralToUSD, debitToUSD, calcCollateralRatio } from '@/utils/loan';
import { STABLE_COIN } from '@/config';
import FixedU128 from '@/utils/fixed_u128';
import useMobileMatch from '@/hooks/mobile-match';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
            },
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',

            flexShrink: 0,
            minWidth: 120,
            height: 100,
            padding: '27px 16px 8px',
            cursor: 'pointer',

            [theme.breakpoints.down('sm')]: {
                padding: '13px 52px',
                width: 'auto',
                height: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
            },

            '&.active': {
                border: `1px solid ${theme.palette.primary.main}`,
            },

            '&.addContent': {
                alignItem: 'center',
                justifyContent: 'center',
            },

            '&.overview': {
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                textTransform: 'uppercase',
            },
        },
        header: {
            [theme.breakpoints.down('sm')]: {
                width: 'auto',
                '& img': {
                    marginLeft: 10,
                },
            },
        },
        addLoan: {
            [theme.breakpoints.down('sm')]: {
                marginTop: 13,
                '& $paper': {
                    flexDirection: 'column',
                    height: 89,
                },
            },
        },
    }),
);

const Content = withStyles((theme: Theme) => ({
    root: {
        marginTop: 9.2,
        textAlign: 'center',
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.secondary.main),
    },
}))(Typography);

interface ItemProps {
    active: boolean;
    onClick: () => void;
}
const AddLoan: React.FC<ItemProps> = ({ active, onClick }) => {
    const classes = useStyle();
    const { t } = useTranslate();
    return (
        <Grid item onClick={onClick} className={clsx(classes.addLoan, { active })}>
            <Paper elevation={1} className={clsx(classes.paper, { addContent: true })} square={true}>
                <img src={add} alt="add" />
                <Content>{t('Create Loan')}</Content>
            </Paper>
        </Grid>
    );
};

const Overview: React.FC<ItemProps> = ({ active, onClick }) => {
    const classes = useStyle();
    return (
        <Grid item onClick={onClick}>
            <Paper
                elevation={1}
                className={clsx(classes.paper, {
                    active,
                    overview: true,
                })}
                square={true}
            >
                <Typography variant="body2">Overview</Typography>
            </Paper>
        </Grid>
    );
};

interface Props {
    active: Active;
    onOverview: () => void;
    onAdd: () => void;
    onSelect: (loan: number) => void;
}

const ZERO = FixedU128.fromNatural(0);

export type Active = 'overview' | 'add_loan' | number;

export const LoanList: React.FC<Props> = ({ active, onOverview, onAdd, onSelect }) => {
    const classes = useStyle();
    const cdpTypes = useSelector(cdpTypeSelector);
    const userLoans = useSelector(loansSelector);
    const prices = useSelector(pricesFeedSelector);
    const mobileMatch = useMobileMatch('sm');

    const stableCoinPrice = prices.find(item => item.asset === STABLE_COIN) || { price: ZERO };
    const renderContent = () =>
        userLoans.map(item => {
            const loan = cdpTypes.find(loan => loan.asset === item.asset);

            if (!loan) return null;

            const collateralPrice = prices.find(price => price.asset === item.asset) || { price: ZERO };
            const currentCollateralRatio = calcCollateralRatio(
                collateralToUSD(item.collateral, collateralPrice.price),
                debitToUSD(item.debit, loan.debitExchangeRate, stableCoinPrice.price),
            );
            const status = currentCollateralRatio.isGreaterThan(
                loan.requiredCollateralRatio.add(FixedU128.fromNatural(0.2)),
            );

            return (
                <Grid item key={`loan-type-${item.asset}`} onClick={() => onSelect(item.asset)}>
                    <Paper
                        elevation={mobileMatch ? 0 : 1}
                        className={clsx(classes.paper, { active: active === item.asset })}
                        square={true}
                    >
                        <Grid container justify="space-between" alignItems="center" className={classes.header}>
                            <Typography variant="h6">{getAssetName(item.asset)}</Typography>
                            <img src={getAssetIcon(item.asset)} alt={`icon-${item.asset}`} width={20} />
                        </Grid>
                        <Typography variant="body1">
                            <Formatter
                                type="ratio"
                                data={currentCollateralRatio}
                                color={status ? 'primary' : 'warning'}
                            />
                        </Typography>
                    </Paper>
                </Grid>
            );
        });
    return (
        <Grid container spacing={mobileMatch ? 0 : 2} className={classes.root}>
            {!isEmpty(userLoans) && <Overview onClick={onOverview} active={active === 'overview'} />}
            {renderContent()}
            <AddLoan onClick={onAdd} active={active === 'add_loan'} />
        </Grid>
    );
};
