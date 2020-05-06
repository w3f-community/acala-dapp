import React, { FC } from 'react';

import { Page, Grid } from '@honzon-platform/ui-components';

import { UserCard } from './components/UserCard';
import { WalletBalanceCard, AirDrop } from '@honzon-platform/react-components';

const PageWallet: FC = () => {
  return (
    <Page>
      <Page.Title title='Wallet' />
      <Page.Content>
        <Grid container
          direction='column'>
          <Grid item>
            <UserCard />
          </Grid>
          <Grid item>
            <WalletBalanceCard
              showCell={['token', 'amount', 'price', 'balance', 'action']}
              showHeader
              title='Balance'
            />
          </Grid>
          <Grid item>
            <AirDrop />
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
