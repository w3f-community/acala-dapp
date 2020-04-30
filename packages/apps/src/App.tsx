import React, { FC } from 'react';

import { ConnectError, NoAccounts, NoExtensions } from '@honzon-platform/react-components';
import { UIProvider, Notification } from '@honzon-platform/ui-components';
import { ApiProvider, AccountProvider } from '@honzon-platform/react-environment';
import { useAppSetting } from '@honzon-platform/react-hooks/useAppSetting';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';

const App: FC = () => {
  const { endpoint } = useAppSetting();
  return (
    <UIProvider>
      <Notification>
          <ApiProvider
            endpoint={endpoint}
            ConnectError={<ConnectError />}
          >
            <AccountProvider
              applicationName={'Acala Honzon Platfrom'}
              NoAccounts={<NoAccounts />}
              NoExtensions={<NoExtensions />}
            >
              <RouterProvider config={routerConfig} />
            </AccountProvider>
          </ApiProvider>
      </Notification>
    </UIProvider>
  );
};

export default App;
