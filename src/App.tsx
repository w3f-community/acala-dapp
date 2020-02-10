import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { HashRouter as Router } from 'react-router-dom';
import createStore from '@/store';
import router from '@/router';
import theme from '@/theme';
import { Translator, Provider as I18nProvider } from './hooks/i18n';
import i18n from '@/i18n';
import { EnvironmentProvider } from './hooks/environment';

// create redux store
const store = createStore();
const translator = new Translator({
    language: 'en',
    feedback: 'en',
    i18n: i18n,
});

const App: React.FC = function() {
    return (
        <Router>
            <EnvironmentProvider>
                <StoreProvider store={store}>
                    <I18nProvider translator={translator}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            {router}
                        </ThemeProvider>
                    </I18nProvider>
                </StoreProvider>
            </EnvironmentProvider>
        </Router>
    );
};

export default App;
