import React, { FC, ReactElement } from 'react';

import { Page, Tabs, ComingSoon } from '@honzon-platform/ui-components';
import { StakingPoolProvider } from '@honzon-platform/react-components';

import { Liquid } from './components/Liquid';

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
    <Page>
      <Page.Title title={'Liquid Asset'} />
      <Page.Content>
        <StakingPoolProvider>
          <Tabs
            config={tabsConfig}
            style='button'
          />
        </StakingPoolProvider>
      </Page.Content>
    </Page>
  );
};

export default PageHoma;
