import React, { FC } from 'react';
import { UIProvider } from '@honzon-platform/ui-components';

const App: FC = () => {
  return (
    <UIProvider>
      <div className='App'>
        <p>hello</p>
      </div>
    </UIProvider>
  );
};

export default App;
