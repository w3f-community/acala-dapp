import React, { FC, useState } from 'react';

import { Page, Grid } from '@honzon-platform/ui-components';
import { SwapProvider } from '@honzon-platform/react-components';
import { UserCard } from './components/UserCard';
import { SystemCard } from './components/SystemCard';
import { SelectAction } from './components/SelectAction';
import { DepositProvider } from './components/Provider';
import { Console } from './components/Console';
import { PoolOverview } from './components/PoolOverview';

const PageDeposit: FC = () => {
  return (
    <Page>
      <Page.Title title='Deposit & Earn' />
      <SwapProvider>
        <Page.Content>
          <DepositProvider>
            <Grid container direction='column'>
              <Grid item container direction='row'>
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
            </Grid>
          </DepositProvider>
        </Page.Content>
      </SwapProvider>
    </Page>
  );
};

export default PageDeposit;
