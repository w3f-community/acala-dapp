import React, { FC, useContext } from 'react';

import { Page, Grid } from '@honzon-platform/ui-components';
import { PricesFeedCard, WalletBalanceCard } from '@honzon-platform/react-components';

import { LoanTopBar } from './components/LoanTopBar';
import { CreateConsole } from './components/CreateConsole';
import { LoanProvider, LoanContext } from './components/LoanProvider';
import { LoanConsole } from './components/LoanConsole';
import { SystemInfoCard } from './components/SystemInfoCard';
import { CollateralCard } from './components/CollateralCard';
import { Overview } from './components/Overview';
import { Transaction } from './components/Transaction';

const Inner: FC = () => {
  const { currentTab } = useContext(LoanContext);

  return (
    <Page>
      <Page.Title title='Self Serviced Loan' />
      <Page.Content>
        <Grid direction='column'>
          {
            currentTab !== 'create'
              ? (
                <Grid item>
                  <LoanTopBar />
                </Grid>
              ) : null
          }
          <Grid container
            direction='row'
            item>
            <Grid container
              direction='column'
              flex={18}
              item>
              {
                currentTab === 'overview'
                  ? (
                    <Grid item>
                      <Overview />
                    </Grid>
                  ) : null
              }
              {
                currentTab === 'create'
                  ? (
                    <Grid item>
                      <CreateConsole />
                    </Grid>
                  ) : null
              }
              {
                currentTab !== 'create' &&
                    currentTab !== 'overview'
                  ? (
                    <Grid item>
                      <LoanConsole />
                    </Grid>
                  ) : null
              }
              {
                currentTab !== 'create' &&
                    currentTab !== 'overview'
                  ? (
                    <Grid item>
                      <Transaction />
                    </Grid>
                  ) : null
              }
            </Grid>
            <Grid container
              direction='column'
              flex={6}
              item>
              <Grid item>
                <WalletBalanceCard />
              </Grid>
              <Grid item>
                <PricesFeedCard />
              </Grid>
              <Grid item>
                <SystemInfoCard />
              </Grid>
              <Grid item>
                <CollateralCard />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Page.Content>
    </Page>
  );
};

const PageLoan: FC = () => {
  return (
    <LoanProvider>
      <Inner />
    </LoanProvider>
  );
};

export default PageLoan;
