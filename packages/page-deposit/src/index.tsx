import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';
import { UserCard } from './components/UserCard';
import { SystemCard } from './components/SystemCard';
import { SelectAction } from './components/SelectAction';
import { DepositProvider } from './components/Provider';
import { Console } from './components/Console';
import { PoolOverview } from './components/PoolOverview';
import { Transaction } from './components/Transaction';
import { WalletBalanceCard, PricesFeedCard } from '@acala-dapp/react-components';

const PageDeposit: FC = () => {
  return (
    <Page>
      <Page.Title title='Deposit & Earn' />
      <Page.Content>
        <DepositProvider>
          <Grid container
            direction='row'>
            <Grid container
              direction='column'
              item
              lg={8}
              md={12}>
              <Grid container
                direction='row'
                item>
                <Grid item>
                  <UserCard />
                </Grid>
                <Grid item>
                  <SystemCard />
                </Grid>
              </Grid>
              <Grid item>
                <SelectAction />
              </Grid>
              <Grid item>
                <Console />
              </Grid>
              <Grid item>
                <PoolOverview />
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
        </DepositProvider>
      </Page.Content>
    </Page>
  );
};

export default PageDeposit;
