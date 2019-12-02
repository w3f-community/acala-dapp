import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import createStore from './store';
import router from './router';

// create redux store
const store = createStore();

// create thme
const theme = createMuiTheme({});

export default function() {
    return (
        <StoreProvider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {router}
            </ThemeProvider>
        </StoreProvider>
    );
}
