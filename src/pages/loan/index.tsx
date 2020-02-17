import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, makeStyles, createStyles, Theme, withStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { isEmpty } from 'lodash';

import actions from '@/store/actions';
import { COLLATERAL, STABLE_COIN, assets } from '@/config';
import { loansSelector } from '@/store/loan/selectors';
import useMobileMatch from '@/hooks/mobile-match';
import { loadingSelector } from '@/store/loading/reducer';
import { FETCH_VAULTS } from '@/store/loan/actions';
import Page from '@/components/page';

import PricesFeed from './components/prices-feed';
import { Active as LoanListActive, LoanList } from './components/loan-list';
import SystemInfo from './components/system-info';
import CollateralInfo from './components/collateral-info';
import LoanConsole from './components/loan-console';
import TransactionHistory from './components/transactions-history';
import LoanPanel from './components/loan-panel';
import AddLoan from './components/add-loan';
import WalletBalance from './components/account-balance';
import Guide from './components/guide';
import Overview from './components/overview';

const Detail = withStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginTop: 0,
        },
    },
}))(Grid);

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        page: {
            [theme.breakpoints.down('lg')]: {
                maxWidth: 1200,
            },
            [theme.breakpoints.up('xl')]: {
                maxWidth: 1600,
            },
        },
        systemInfo: {
            [theme.breakpoints.down('md')]: {
                flex: '1 1 100%',
                marginTop: 32,
                marginLeft: 0,
            },
        },
        loanInfo: {
            [theme.breakpoints.down('sm')]: {
                marginTop: 32,
            },
        },
        gap: { marginBottom: theme.spacing(2) },
    }),
);

const Loan: React.FC = () => {
    const dispatch = useDispatch();
    const [currentLoan, setCurrentLoan] = useState<number>(0);
    const [isAddLoan, setAddLoan] = useState<boolean>(false);
    // show overview as default
    const [isOverview, setIsShowOverview] = useState<boolean>(true);
    const [active, setActive] = useState<LoanListActive>('overview');
    const userLoans = useSelector(loansSelector);
    const isLoadingLoan = useSelector(loadingSelector(FETCH_VAULTS));
    const classes = useStyle();
    const showAddLoan = () => {
        setAddLoan(true);
        setActive('add_loan');
    };
    const hideAddLoan = () => setAddLoan(false);
    const showOverview = () => {
        setIsShowOverview(true);
        setActive('overview');
    };
    const hideOverview = () => setIsShowOverview(false);
    const match = useMobileMatch('sm');
    const mdMatch = useMobileMatch('md');

    useEffect(() => {
        // fetch default constants
        dispatch(actions.chain.fetchConstants.request({}));
        // fetch user loans info
        dispatch(actions.loan.fetchLoans.request(COLLATERAL));
        // fetch user asset balance
        dispatch(actions.account.fetchAssetsBalance.request(Array.from(assets.keys())));
        // fetch tokens total issuance
        dispatch(actions.chain.fetchTotalIssuance.request([STABLE_COIN]));
        // fetch system loans info
        dispatch(actions.chain.fetchCdpTypes.request(COLLATERAL));
        // load tx record
        dispatch(actions.loan.loadTxRecord());
    }, [dispatch]);

    const handleLoanSelect = (asset: number) => {
        setCurrentLoan(asset);
        setActive(asset);
        hideAddLoan();
        hideOverview();
    };

    const handleAddLoanSuccess = (asset: number) => {
        setCurrentLoan(asset);
        setActive(asset);
        hideAddLoan();
        hideOverview();
    };

    const renderContent = () => {
        if (typeof isLoadingLoan !== 'boolean') {
            return null;
        }
        if (isLoadingLoan === true) {
            return <Skeleton variant="rect" width="100%" height={500} />;
        }
        if (isAddLoan) {
            return <AddLoan onCancel={hideAddLoan} onSuccess={handleAddLoanSuccess} />;
        }
        if (isEmpty(userLoans)) {
            return <Guide onConfirm={showAddLoan} />;
        }
        if (isOverview) {
            return <Overview onSelect={handleLoanSelect} />;
        }
        return (
            <>
                <LoanPanel current={currentLoan} />
                <Box paddingTop={match ? 4 : 2} />
                <LoanConsole current={currentLoan} />
                <Box paddingTop={match ? 4 : 2} />
                <TransactionHistory asset={currentLoan} />
            </>
        );
    };

    return (
        <Page className={classes.page}>
            <Grid container direction={match ? 'column' : 'row'}>
                <LoanList active={active} onOverview={showOverview} onAdd={showAddLoan} onSelect={handleLoanSelect} />
            </Grid>
            <Detail spacing={2} container direction={match ? 'column' : 'row'} wrap={mdMatch ? 'wrap' : 'nowrap'}>
                <Grid item md={12} lg={8} xl={9} className={classes.loanInfo}>
                    {renderContent()}
                </Grid>
                <Grid item md={12} lg={4} xl={3} className={classes.systemInfo}>
                    <WalletBalance className={classes.gap} />
                    <PricesFeed className={classes.gap} />
                    <SystemInfo className={classes.gap} />
                    <CollateralInfo current={currentLoan} className={classes.gap} />
                </Grid>
            </Detail>
        </Page>
    );
};

export default Loan;
