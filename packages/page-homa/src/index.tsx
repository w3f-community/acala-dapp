import React, { FC } from 'react';

import { Page, Tabs } from '@honzon-platform/ui-components';
import { StakingPoolProvider } from '@honzon-platform/react-components';

import { Mint } from './components/Mint';
import { Redeem } from './components/Redeem';

const PageHoma: FC = () => {
  const tabsConfig = [
    {
      title: 'Mint',
      render: () => {
        return <Mint />
      }
    },
    {
      title: 'Redeem',
      render: () => {
        return <Redeem />
      }
    }
  ]
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
