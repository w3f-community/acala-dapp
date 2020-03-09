import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, withStyles } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';

import add from '@honzon-platform/apps/assets/add.svg';
import { getAssetName, getAssetIcon } from '@honzon-platform/apps/utils';
import { cdpTypeSelector, pricesFeedSelector } from '@honzon-platform/apps/store/chain/selectors';
import { loansSelector } from '@honzon-platform/apps/store/loan/selectors';
import Formatter from '@honzon-platform/apps/components/formatter';
import clsx from 'clsx';
import { collateralToUSD, debitToUSD, calcCollateralRatio } from '@honzon-platform/apps/utils/loan';
import { STABLE_COIN } from '@honzon-platform/apps/config';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import useMobileMatch from '@honzon-platform/apps/hooks/mobile-match';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import { createTypography } from '@honzon-platform/apps/theme';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minHeight: 100,
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
            },
        },
        paper: {
            position: 'relative',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',

            flexShrink: 0,
            minWidth: 120,
            height: 100,
            padding: '17px 12px 12px',
            cursor: 'pointer',

            [theme.breakpoints.down('sm')]: {
                padding: '13px 52px',
                width: 'auto',
                height: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
            },

            '&.active::before': {
                content: "''", // FIXME: material-ui issue: https://github.com/mui-org/material-ui/issues/11839
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: `1px solid ${theme.palette.primary.light}`,
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
const AddLoan: React.FC<Omit<ItemProps, 'active'>> = ({ onClick }) => {
    const classes = useStyle();
    const { t } = useTranslate();
    return (
        <Grid item onClick={onClick} className={clsx(classes.addLoan)}>
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

const ZERO = FixedU128.ZERO;

export type Active = 'overview' | 'add_loan' | number;

export const LoanList: React.FC<Props> = ({ active, onOverview, onAdd, onSelect }) => {
    const classes = useStyle();
    const cdpTypes = useSelector(cdpTypeSelector);
    const userLoans = useSelector(loansSelector);
    const prices = useSelector(pricesFeedSelector);
    const mobileMatch = useMobileMatch('sm');
    const stableCoinPrice = prices.find(item => item.asset === STABLE_COIN) || { price: ZERO };
    const checkIfShowAdd = () => {
        if (!active) {
            return true;
        }
        if (active === 'add_loan') {
            return false;
        }
        return true;
    };
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
            {checkIfShowAdd() && <AddLoan onClick={onAdd} />}
        </Grid>
    );
};
