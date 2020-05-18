import React, { FC } from 'react';

import { Page, Grid } from '@honzon-platform/ui-components';
import { SwapConsole } from './components/SwapConsole';
import { WalletBalanceCard, PricesFeedCard } from '@honzon-platform/react-components';
import { AllMarkets } from './components/AllMarkets';
import { Transaction } from './components/Transaction';
import { SwapProvider } from './components/SwapProvider';

const PageSwap: FC = () => {
  return (
    <SwapProvider>
      <Page>
        <Page.Title title='Swap' />
          <Page.Content>
            <Grid container direction='row'>
              <Grid container item direction='column' md={12} lg={8}>
                <Grid item>
                  <SwapConsole />
                </Grid>
                <Grid item>
                  <AllMarkets />
                </Grid>
                <Grid item>
                  <Transaction />
                </Grid>
              </Grid>
              <Grid container item direction='column' md={12} lg={4}>
                <Grid item>
                  <WalletBalanceCard />
                </Grid>
                <Grid item>
                  <PricesFeedCard />
                </Grid>
              </Grid>
            </Grid>
          </Page.Content>
      </Page>
    </SwapProvider>
  );
};

export default PageSwap;
