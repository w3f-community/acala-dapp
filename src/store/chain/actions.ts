import { createAsyncAction } from 'typesafe-actions';

interface IConnectParam {
    endpoint: string,
    types: any
}
export const CONNECT_ASYNC = '@chain/connect';
export const connectAsync = createAsyncAction(
    CONNECT_ASYNC,
    '@chain/connect/success',
    '@chain/connnect/failure',
)<IConnectParam, any, string>();