import React, { FC } from 'react';

import { Page } from '@honzon-platform/ui-components';
import { SwapConsole } from './components/SwapConsole';
import { Grid } from 'semantic-ui-react';
import { SwapProvider, WalletBalanceCard } from '@honzon-platform/react-components';

const PageSwap: FC = () => {
  return (
    <Page>
      <Page.Title title='Swap' />
      <SwapProvider>
        <Page.Content>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <SwapConsole />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <WalletBalanceCard />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Page.Content>
      </SwapProvider>
    </Page>
  );
};

export default PageSwap;
