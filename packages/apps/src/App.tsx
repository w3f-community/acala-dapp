import React, { FC } from 'react';

import { ConnectError, NoAccounts, NoExtensions } from '@acala-dapp/react-components';
import { UIProvider, Notification, FullLoading } from '@acala-dapp/ui-components';
import { ApiProvider, AccountProvider, GlobalStoreProvider } from '@acala-dapp/react-environment';
import { useAppSetting } from '@acala-dapp/react-hooks/useAppSetting';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';

const App: FC = () => {
  const { endpoints } = useAppSetting();

  return (
    <UIProvider>
      <Notification>
        <ApiProvider
          ConnectError={<ConnectError />}
          Loading={<FullLoading />}
          endpoints={endpoints}
        >
          <AccountProvider
            NoAccounts={<NoAccounts />}
            NoExtensions={<NoExtensions />}
            applicationName={'Acala Dapp'}
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
