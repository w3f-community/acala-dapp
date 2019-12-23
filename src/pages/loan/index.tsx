import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, makeStyles, createStyles, Theme } from '@material-ui/core';

import actions from '@/store/actions';
import { COLLATERAL, STABLE_COIN, assets } from '@/config';
import { accountVaultsSelector } from '@/store/account/selectors';
import Page from '@/components/page';
import useMobileMatch from '@/hooks/mobile-match';

import PricesFeed from './components/prices-feed';
import VaultsList from './components/vaults-list';
import SystemInfo from './components/system-info';
import CollateralInfo from './components/collateral-info';
import VaultPanel from './components/vault-panel';
import TransactionHistory from './components/transitions-history';
import VaultInfo from './components/vault-info';
import AddVault from './components/add-vault';
import TxStatus from '@/components/tx-status';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        detail: {
            marginTop: 57,
            [theme.breakpoints.down('sm')]: {
                marginTop: 0,
            },
        },
    }),
);

const Loan: React.FC = () => {
    const dispatch = useDispatch();
    const [currentVault, setCurrentVault] = useState<number>(0);
    const [addVaultStatus, setAddVaultstatus] = useState<boolean>();
    const userVaults = useSelector(accountVaultsSelector);
    const match = useMobileMatch('sm');
    const classes = useStyle();

    const showAddVault = () => setAddVaultstatus(true);
    const hideAddVault = () => setAddVaultstatus(false);

    useEffect(() => {
        // fetch user vaults info
        dispatch(actions.account.fetchVaults.request(COLLATERAL));
        // fetch user asset balance
        dispatch(actions.account.fetchAssetsBalance.request(Array.from(assets.keys())));
        // fetch tokens total issuance
        dispatch(actions.chain.fetchTotalIssuance.request([STABLE_COIN]));
        // fetch system vaults info
        dispatch(actions.chain.fetchVaults.request(COLLATERAL));
        // load tx record
        dispatch(actions.vault.loadTxRecord());
    }, []);

    useEffect(() => {
        // if user vaults is empty then show add vault view
        if (addVaultStatus === false && userVaults.length === 0) {
            setAddVaultstatus(true);
        }
        // set default vault
        if (userVaults.length) {
            setCurrentVault(userVaults[0].asset);
        }
    }, [userVaults]);

    const handleVaultSelect = (vault: number) => {
        setCurrentVault(vault);
        setAddVaultstatus(false);
    };

    return (
        <Page padding={match ? '20px' : '46px 55px'}>
            <Grid container spacing={match ? 0 : 6} direction={match ? 'column' : 'row'}>
                <VaultsList onAdd={showAddVault} onSelect={handleVaultSelect} />
            </Grid>
            <Grid container spacing={6} direction={match ? 'column' : 'row'} className={classes.detail}>
                <Grid item xs={12} lg={8}>
                    {addVaultStatus ? (
                        <AddVault onCancel={hideAddVault} />
                    ) : (
                        <>
                            <VaultInfo current={currentVault} />
                            <Box paddingTop={match ? 4 : 7} />
                            <VaultPanel current={currentVault} />
                            <Box paddingTop={match ? 4 : 7} />
                            <TransactionHistory current={currentVault} />
                        </>
                    )}
                </Grid>
                <Grid item xs={12} lg={4}>
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
