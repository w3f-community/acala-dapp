import React, { FC } from 'react';

import { Page, Grid } from '@honzon-platform/ui-components';

import { UserCard } from './components/UserCard';
import { WalletBalanceCard } from '@honzon-platform/react-components';

const PageWallet: FC = () => {
  return (
    <Page>
      <Page.Title title='Wallet' />
      <Page.Content>
        <Grid container direction='column'>
          <Grid item>
            <UserCard />
          </Grid>
          <Grid item>
            <WalletBalanceCard
              title='Balance'
              showHeader
              showCell={['token', 'amount', 'price', 'balance', 'action']}
            />
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
  );
};

export default PageWallet;
