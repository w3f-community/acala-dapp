import React, { FC } from 'react';

import { ConnectError, SelectAccount } from '@honzon-platform/react-components';
import { UIProvider, FullScreenLoading } from '@honzon-platform/ui-components';
import { ApiProvider, AccountProvider } from '@honzon-platform/react-environment';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';

const App: FC = () => {
  return (
    <UIProvider>
      <ApiProvider
        ConnectError={<ConnectError />}
        endpoint='ws://127.0.0.1:9944'
        Loading={<FullScreenLoading />}
      >
        <AccountProvider
          applicationName={'Acala Honzon Platfrom'}
          SelectAccount={<SelectAccount />}
        >
          <RouterProvider config={routerConfig} />
        </AccountProvider>
      </ApiProvider>
    </UIProvider>
  );
};

export default App;
