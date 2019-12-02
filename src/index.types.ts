import { RootState } from "typesafe-actions";
import { Theme } from '@material-ui/core/styles/createMuiTheme';

export {}
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

// selector function declare
export interface ISelector {
    toJS?: boolean
};
export type Selector<Params, Result> = (config: ISelector & Params) => (state: RootState) => Result;
