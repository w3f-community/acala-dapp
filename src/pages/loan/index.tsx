import React from 'react';
import { Grid, Box } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';

import { Vault, SystemInfoData, CollateralInfoData } from './index.types';

import FeedPrices from './components/feed-prices';
import VaultsList from './components/vaults-list';
import SystemInfo from './components/system-info';
import CollateralInfo from './components/collateral-info';
import VaultPanel from './components/vault-panel';

const Loan: React.FC = () => {
    const { t } = useTranslate();
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

    return (
        <div>
            <VaultsList vaults={vaults} />
            <Box paddingTop={7} />
            <Grid container spacing={6}>
                <Grid item xs={8}>
                    <VaultPanel asset={2}/>
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
