import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { StateType, ActionType } from 'typesafe-actions';

// declare window
declare global {
    interface Window {
        reload: any;
        // declare for redux devtools
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    }
}

// custom @material-ui theme
declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        sidebar: {
            width: React.CSSProperties['width'];
        };
    }
    interface ThemeOptions {
        sidebar?: {
            width?: React.CSSProperties['width'];
        };
    }
}

// overwrite RootAction type
declare module 'typesafe-actions' {
    export type RootAction = ActionType<typeof import('@honzon-platform/apps/store/actions').default>;
    export type RootState = StateType<typeof import('@honzon-platform/apps/store/reducer').default>;

    interface Types {
        RootAction: RootAction;
    }
}
