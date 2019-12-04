import { createAsyncAction } from 'typesafe-actions';

interface ConnectParam {
    endpoint: string;
    types: any;
}
export const CONNECT_ASYNC = '@chain/connect';
export const connectAsync = createAsyncAction(CONNECT_ASYNC, '@chain/connect/success', '@chain/connnect/failure')<
    ConnectParam,
    any,
    string
>();
