import React, { FC, PropsWithChildren } from 'react';

import 'semantic-ui-css/semantic.min.css';
import './styles/overwrite.css';

export const UIProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};
