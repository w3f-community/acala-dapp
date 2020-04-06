import React, { FC } from 'react';
import { UIProvider } from '@honzon-platform/ui-components';

import { RouterProvider } from './components/RouterProvider';
import { config as routerConfig } from './router-config';

const App: FC = () => {
  return (
    <UIProvider>
      <RouterProvider config={routerConfig} />
    </UIProvider>
  );
};

export default App;
