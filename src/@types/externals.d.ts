import { Theme } from '@material-ui/core/styles/createMuiTheme';

// declare window
declare global {
    interface Window {
        // declare for redux devtools
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    }
}

// custom @material-ui theme
declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme { }
    interface ThemeOptions { }
}