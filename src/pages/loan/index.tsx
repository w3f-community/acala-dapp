import React from 'react';
import { Grid, Box } from '@material-ui/core';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import { Vault, SystemInfoData, CollateralInfoData, TransactionHistoryData, CurrentVault } from './index.types';

import FeedPrices from './components/feed-prices';
import VaultsList from './components/vaults-list';
import SystemInfo from './components/system-info';
import CollateralInfo from './components/collateral-info';
import VaultPanel from './components/vault-panel';
import TransactionHistory from './components/transaction-history';
import VaultInfo from './components/vault-info';
import AddVault from './components/add-vault';

const Loan: React.FC = () => {
    const vaults: Vault[] = [
        {
            asset: 2,
            liquidationRatio: 150,
            stabilityFee: 5,
        },
    ];
    const feedData = [
        {
            asset: 1,
            price: 285.44,
        },
        {
            asset: 2,
            price: 8010.44,
        },
    ];
    const systemInfo: SystemInfoData = {
        aUSDSupply: 12312313,
    };

    const collateralInfo: { [k: number]: CollateralInfoData } = {
        2: {
            liquidationRatio: 150,
            stabilityFee: 5,
        },
    };

    const mockTransactionHistoryData: TransactionHistoryData[] = [
        {
            asset: 2,
            action: 'Create CDP',
            when: 112312312,
            from: 'sdfsdfsdfsd',
            tx: 'xxxxxxxxxxxx',
        },
    ];

    const mockCurrentVault: CurrentVault = {
        asset: 2,
        stabilityFee: 5,
        currentCollateralRatio: 200,
        liquidationRatio: 200,
        liquidationPrice: 250,
        liquidationPenalty: 5,
    };

    return (
        <div>
            <VaultsList vaults={vaults} />
            <Box paddingTop={7} />
            <Grid container spacing={6}>
                <Grid item xs={8}>
                    <Router>
                        <Switch>
                            <Route path="/loan/add">
                                <AddVault />
                            </Route>
                            <Route path="/loan">
                                <>
                                    <VaultInfo data={mockCurrentVault} />
                                    <Box paddingTop={7} />
                                    <VaultPanel asset={2} />
                                    <Box paddingTop={7} />
                                    <TransactionHistory data={mockTransactionHistoryData} />
                                </>
                            </Route>
                        </Switch>
                    </Router>
                </Grid>
                <Grid item xs={4}>
                    <FeedPrices data={feedData} />
                    <Box paddingTop={3} />
                    <SystemInfo data={systemInfo} />
                    <Box paddingTop={3} />
                    <CollateralInfo current={2} data={collateralInfo} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Loan;
