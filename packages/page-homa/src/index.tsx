import React, { FC, ReactElement } from 'react';

import { Page, Tabs } from '@honzon-platform/ui-components';
import { StakingPoolProvider } from '@honzon-platform/react-components';

import { Mint } from './components/Mint';
import { Redeem } from './components/Redeem';

const PageHoma: FC = () => {
  const tabsConfig = [
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactElement => <Mint />,
      title: 'Mint'
    },
    {
      /* eslint-disable-next-line react/display-name */
      render: (): ReactElement => <Redeem />,
      title: 'Redeem'
    }
  ];

  return (
    <Page>
      <Page.Title title={'Homa'} />
      <Page.Content>
        <StakingPoolProvider>
          <Tabs config={tabsConfig} />
        </StakingPoolProvider>
      </Page.Content>
    </Page>
  );
};

export default PageHoma;
