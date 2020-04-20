import React, { FC, useState } from 'react';

import { Page } from '@honzon-platform/ui-components';
import { Grid } from 'semantic-ui-react';
import { SwapProvider } from '@honzon-platform/react-components';
import { UserCard } from './components/UserCard';
import { SystemCard } from './components/SystemCard';
import { ACTION_TYPE } from './types';
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
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <UserCard />
                </Grid.Column>
                <Grid.Column>
                  <SystemCard />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <SelectAction />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Console />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <PoolOverview />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </DepositProvider>
        </Page.Content>
      </SwapProvider>
    </Page>
  );
};

export default PageDeposit;
