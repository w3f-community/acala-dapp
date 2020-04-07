import React, { FC, PropsWithChildren } from 'react';
import props from 'prop-types';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import theme from './theme';

export const UIProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        {children}
      </CssBaseline>
    </ThemeProvider>
  );
};

UIProvider.propTypes = {
  children: props.element
};
