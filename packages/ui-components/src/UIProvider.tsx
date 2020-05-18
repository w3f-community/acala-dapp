import React, { FC, ReactElement } from 'react';

import './styles/index.scss';
import './styles/global.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1366,
      lg: 1366,
      xl: 1920,
    },
  },
});

export const UIProvider: FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
