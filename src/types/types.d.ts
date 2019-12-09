import { StateType, ActionType } from 'typesafe-actions';

// overwrite RootAction type
declare module 'typesafe-actions' {
    export type RootAction = ActionType<typeof import('./actions').default>;
    export type RootState = StateType<typeof import('./reducer').default>;

    interface Types {
        RootAction: RootAction;
    }
}
