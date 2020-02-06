import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, makeStyles, createStyles, Theme } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { isEmpty } from 'lodash';

import actions from '@/store/actions';
import { COLLATERAL, STABLE_COIN, assets } from '@/config';
import { vaultsSelector } from '@/store/vault/selectors';
import useMobileMatch from '@/hooks/mobile-match';
import { loadingSelector } from '@/store/loading/reducer';
import { FETCH_VAULTS } from '@/store/vault/actions';
import Page from '@/components/page';

import PricesFeed from './components/prices-feed';
import { Active as VaultListActive, VaultsList } from './components/vaults-list';
import SystemInfo from './components/system-info';
import CollateralInfo from './components/collateral-info';
import VaultConsole from './components/vault-console';
import TransactionHistory from './components/transactions-history';
import VaultPanel from './components/vault-panel';
import AddVault from './components/add-vault';
import WalletBalance from './components/account-balance';
import Guide from './components/guide';
import Overview from './components/overview';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        detail: {
            marginTop: 57,
            [theme.breakpoints.down('sm')]: {
                marginTop: 0,
            },
        },
        systemInfo: {
            flex: '0 0 349px',
            marginLeft: 48,
            [theme.breakpoints.down('md')]: {
                flex: '1 1 100%',
                marginTop: 32,
                marginLeft: 0,
            },
        },
        vaultInfo: {
            [theme.breakpoints.down('sm')]: {
                marginTop: 32,
            },
        },
    }),
);

const Loan: React.FC = () => {
    const dispatch = useDispatch();
    const [currentVault, setCurrentVault] = useState<number>(0);
    const [isAddVault, setAddVault] = useState<boolean>(false);
    // show overview as default
    const [isOverview, setIsShowOverview] = useState<boolean>(true);
    const [active, setActive] = useState<VaultListActive>('overview');
    const userVaults = useSelector(vaultsSelector);
    const isLoadingVault = useSelector(loadingSelector(FETCH_VAULTS));
    const classes = useStyle();
    const showAddVault = () => {
        setAddVault(true);
        setActive('add_vault');
    };
    const hideAddVault = () => setAddVault(false);
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
        // fetch user vaults info
        dispatch(actions.vault.fetchVaults.request(COLLATERAL));
        // fetch user asset balance
        dispatch(actions.account.fetchAssetsBalance.request(Array.from(assets.keys())));
        // fetch tokens total issuance
        dispatch(actions.chain.fetchTotalIssuance.request([STABLE_COIN]));
        // fetch system vaults info
        dispatch(actions.chain.fetchCdpTypes.request(COLLATERAL));
        // load tx record
        dispatch(actions.vault.loadTxRecord());
    }, [dispatch]);

    const handleVaultSelect = (vault: number) => {
        setCurrentVault(vault);
        setActive(vault);
        hideAddVault();
        hideOverview();
    };

    const renderContent = () => {
        if (typeof isLoadingVault !== 'boolean') {
            return null;
        }
        if (isLoadingVault === true) {
            return <Skeleton variant="rect" width="100%" height={500} />;
        }
        if (isAddVault) {
            return <AddVault onCancel={hideAddVault} />;
        }
        if (isEmpty(userVaults)) {
            return <Guide onConfirm={showAddVault} />;
        }
        if (isOverview) {
            return <Overview onSelect={handleVaultSelect} />;
        }
        return (
            <>
                <VaultPanel current={currentVault} />
                <Box paddingTop={match ? 4 : 7} />
                <VaultConsole current={currentVault} />
                <Box paddingTop={match ? 4 : 7} />
                <TransactionHistory current={currentVault} />
            </>
        );
    };

    return (
        <Page fullScreen>
            <Grid container direction={match ? 'column' : 'row'}>
                <VaultsList
                    active={active}
                    onOverview={showOverview}
                    onAdd={showAddVault}
                    onSelect={handleVaultSelect}
                />
            </Grid>
            <Grid
                container
                direction={match ? 'column' : 'row'}
                justify="space-between"
                wrap={mdMatch ? 'wrap' : 'nowrap'}
                className={classes.detail}
            >
                <Grid item xs={12} className={classes.vaultInfo}>
                    {renderContent()}
                </Grid>
                <Grid item md={12} className={classes.systemInfo}>
                    <WalletBalance />
                    <Box paddingTop={3} />
                    <PricesFeed />
                    <Box paddingTop={3} />
                    <SystemInfo />
                    <Box paddingTop={3} />
                    <CollateralInfo current={currentVault} />
                </Grid>
            </Grid>
        </Page>
    );
};

export default Loan;
