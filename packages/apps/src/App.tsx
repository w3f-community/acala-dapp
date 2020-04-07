import React, { FC } from 'react';

import { UIProvider } from '@honzon-platform/ui-components';
import { Environment } from '@honzon-platform/react-components';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';

const App: FC = () => {
  return (
    <UIProvider>
      <Environment endpoint='ws://127.0.0.1:9944'>
        <RouterProvider config={routerConfig} />
      </Environment>
    </UIProvider>
  );
};

export default App;
