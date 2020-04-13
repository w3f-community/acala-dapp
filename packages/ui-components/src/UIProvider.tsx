import React, { FC, PropsWithChildren } from 'react';
import props from 'prop-types';
import { ThemeProvider } from 'styled-components';

import { theme } from './theme';
import 'semantic-ui-css/semantic.min.css';
import './styles/overwrite.css';

export const UIProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

