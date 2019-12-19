import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box } from '@material-ui/core';
import PricesFeed from './components/prices-feed';
import VaultsList from './components/vaults-list';
import SystemInfo from './components/system-info';
import CollateralInfo from './components/collateral-info';
import VaultPanel from './components/vault-panel';
import TransactionHistory from './components/transaction-history';
import VaultInfo from './components/vault-info';
import AddVault from './components/add-vault';
import actions from '@/store/actions';
import { COLLATERAL, STABLE_COIN, assets } from '@/config';
import { accountVaultsSelector } from '@/store/account/selectors';
import Page from '@/components/page';

const Loan: React.FC = () => {
    const dispatch = useDispatch();
    const [currentVault, setCurrentVault] = useState<number>(0);
    const [addVaultStatus, setAddVaultstatus] = useState<boolean>();
    const userVaults = useSelector(accountVaultsSelector);

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
        // fetch tx record
        dispatch(actions.app.fetchTxRecord());
    }, []);

    useEffect(() => {
        // if user vaults is empty then show add vault view
        if (addVaultStatus === false && userVaults.length === 0) {
            setAddVaultstatus(true);
        }
        // set default current vault
        if (userVaults.length) {
            setCurrentVault(userVaults[0].asset);
        }
    }, [userVaults]);

    const handleVaultSelect = (vault: number) => {
        setCurrentVault(vault);
        setAddVaultstatus(false);
    };

    return (
        <Page padding="46px 55px">
            <VaultsList onAdd={showAddVault} onSelect={handleVaultSelect} />
            <Box paddingTop={7} />
            <Grid container spacing={6}>
                <Grid item xs={8}>
                    {addVaultStatus ? (
                        <AddVault onCancel={hideAddVault} />
                    ) : (
                        <>
                            <VaultInfo current={currentVault} />
                            <Box paddingTop={7} />
                            <VaultPanel current={currentVault} />
                            <Box paddingTop={7} />
                            <TransactionHistory current={currentVault} />
                        </>
                    )}
                </Grid>
                <Grid item xs={4}>
                    <PricesFeed />
                    <Box paddingTop={3} />
                    <SystemInfo />
                    <Box paddingTop={3} />
                    <CollateralInfo current={2} />
                </Grid>
            </Grid>
        </Page>
    );
};

export default Loan;
