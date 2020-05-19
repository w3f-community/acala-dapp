import React, { FC } from 'react';

import './styles/index.scss';
import './styles/global.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  breakpoints: {
    values: {
      lg: 1920,
      md: 1920,
      sm: 600,
      xl: 2048,
      xs: 0
    }
  }
});

export const UIProvider: FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
