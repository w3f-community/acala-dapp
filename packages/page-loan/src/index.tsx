import React, { FC, memo, useContext } from 'react';

import { Page, Grid } from '@honzon-platform/ui-components';
import { PricesFeedCard } from '@honzon-platform/react-components';

import { LoanTopBar } from './components/LoanTopBar';
import { WalletBalanceBar } from './components/WalletBalanceBar';
import { CreateConsole } from './components/CreateConsole';
import { LoanProvider, LoanContext } from './components/LoanProvider';
import { LoanConsole } from './components/LoanConsole';
import { SystemInfoCard } from './components/SystemInfoCard';
import { CollateralCard } from './components/CollateralCard';

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
              <Grid item container direction='row'>
                <Grid container item flex={2} direction='column'>
                  <Grid item>
                    <WalletBalanceBar />
                  </Grid>
                  {
                    currentTab === 'create'
                    ? (
                      <Grid item>
                        <CreateConsole />
                      </Grid>
                    ) : null
                  }
                  {
                    currentTab !== 'create'
                    && currentTab !== 'overview'
                    ? (
                      <Grid item>
                        <LoanConsole />
                      </Grid>
                    ) : null
                  }
                </Grid>
                <Grid container item flex={1} direction='column'>
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