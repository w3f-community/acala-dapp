import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';
import { SwapConsole } from './components/SwapConsole';
import { WalletBalanceCard, PricesFeedCard } from '@acala-dapp/react-components';
import { AllMarkets } from './components/AllMarkets';
import { Transaction } from './components/Transaction';
import { SwapProvider } from './components/SwapProvider';

const PageSwap: FC = () => {
  return (
    <SwapProvider>
      <Page>
        <Page.Title title='Swap' />
        <Page.Content>
          <Grid container
            direction='row'>
            <Grid container
              direction='column'
              item
              lg={8}
              md={12}>
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
            <Grid container
              direction='column'
              item
              lg={4}
              md={12}>
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
