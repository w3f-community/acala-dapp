import React, { FC } from 'react';

import { ConnectError, NoAccounts, NoExtensions } from '@honzon-platform/react-components';
import { UIProvider, Notification, FullLoading } from '@honzon-platform/ui-components';
import { ApiProvider, AccountProvider, GlobalStoreProvider } from '@honzon-platform/react-environment';
import { useAppSetting } from '@honzon-platform/react-hooks/useAppSetting';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';

const App: FC = () => {
  const { endpoint } = useAppSetting();

  return (
    <UIProvider>
      <Notification>
        <ApiProvider
          ConnectError={<ConnectError />}
          endpoint={endpoint}
          Loading={<FullLoading />}
        >
          <AccountProvider
            applicationName={'Acala Honzon Platfrom'}
            NoAccounts={<NoAccounts />}
            NoExtensions={<NoExtensions />}
          >
            <GlobalStoreProvider>
              <RouterProvider config={routerConfig} />
            </GlobalStoreProvider>
          </AccountProvider>
        </ApiProvider>
      </Notification>
    </UIProvider>
  );
};

export default App;
