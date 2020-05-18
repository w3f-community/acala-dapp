import React, { FC, ReactElement } from 'react';

import { Page, Tabs, ComingSoon, Grid } from '@honzon-platform/ui-components';

import { Liquid } from './components/Liquid';
import { StakingPoolProvider } from './components/StakingPoolProvider';

const PageHoma: FC = () => {
  const tabsConfig = [
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactElement => <Liquid />,
      title: 'Liquid Asset'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactElement => <ComingSoon />,
      title: 'Vote for Validators'
    }
  ];

  return (
    <StakingPoolProvider>
      <Page>
        <Page.Title title={'Liquid Asset'} />
            <Page.Content>
                <Grid container>
                  <Grid item flex={18}>
                    <Tabs
                      config={tabsConfig}
                      style='button'
                    />
                  </Grid>
                </Grid>
            </Page.Content>
      </Page>
    </StakingPoolProvider>
  );
};

export default PageHoma;
