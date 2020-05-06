import React, { FC } from 'react';

import { Page, Grid } from '@honzon-platform/ui-components';
import { SwapConsole } from './components/SwapConsole';
import { SwapProvider, WalletBalanceCard } from '@honzon-platform/react-components';
import { AllMarkets } from './components/AllMarkets';
import { Transaction } from './components/Transaction';

const PageSwap: FC = () => {
  return (
    <Page>
      <Page.Title title='Swap' />
      <SwapProvider>
        <Page.Content>
          <Grid direction='column'>
            <Grid item>
              <SwapConsole />
            </Grid>
            <Grid item>
              <AllMarkets />
            </Grid>
            <Grid container
            item>
              <Grid item flex={16}>
                <Transaction />
              </Grid>
              <Grid item flex={8}>
                <WalletBalanceCard />
              </Grid>
            </Grid>
          </Grid>
        </Page.Content>
      </SwapProvider>
    </Page>
  );
};

export default PageSwap;
