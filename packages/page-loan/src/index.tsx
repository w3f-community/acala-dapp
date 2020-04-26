import React, { FC, memo, useState } from 'react';
import { Page, Grid } from '@honzon-platform/ui-components';
import { PricesFeedCard, LoanProvider } from '@honzon-platform/react-components';
import { LoanTopBar } from './components/LoanTopBar';
import { WalletBalanceBar } from './components/WalletBalanceBar';
import { CreateConsole } from './components/CreateConsole';

const PageLoan: FC = memo(() => {
  const [createStatus, setCreataeStatus] = useState<boolean>(true);
  const showCreate = () => {
    setCreataeStatus(true);
  };
  const showOverview = () => {
    setCreataeStatus(true);
  };

  return (
    <Page>
      <Page.Title title='Self Serviced Loan' />
        <Page.Content>
          <LoanProvider>
            <Grid direction='column'>
              {
                !createStatus ? (
                  <Grid item>
                    <LoanTopBar
                      onClickCreate={showCreate}
                      onClickOverview={showOverview}
                    />
                  </Grid>
                ) : null
              }
              <Grid item container direction='row'>
                <Grid container item flex={2} direction='column'>
                  <Grid item>
                    <WalletBalanceBar />
                  </Grid>
                  {
                    createStatus ? (
                      <Grid item>
                        <CreateConsole />
                      </Grid>
                    ) : null
                  }
                </Grid>
                <Grid container item flex={1} direction='column'>
                  <Grid item>
                    <PricesFeedCard />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </LoanProvider>
        </Page.Content>
    </Page>
  );
});

PageLoan.displayName = 'PageLoan';

export default PageLoan;
