import { createAsyncAction } from 'typesafe-actions';
import { RegistryTypes } from '@polkadot/types/types';

interface ConnectParam {
    endpoint: string;
    types: RegistryTypes;
}
export const CONNECT_ASYNC = '@chain/connect';
export const connectAsync = createAsyncAction(CONNECT_ASYNC, '@chain/connect/success', '@chain/connnect/failure')<
    ConnectParam,
    any,
    string
>();
