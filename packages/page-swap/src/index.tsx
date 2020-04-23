import React, { FC } from 'react';

import { Page, Grid } from '@honzon-platform/ui-components';
import { SwapConsole } from './components/SwapConsole';
import { SwapProvider, WalletBalanceCard } from '@honzon-platform/react-components';
import { AllMarkets } from './components/AllMarkets';

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
            <Grid item>
              <WalletBalanceCard />
            </Grid>
          </Grid>
        </Page.Content>
      </SwapProvider>
    </Page>
  );
};

export default PageSwap;
