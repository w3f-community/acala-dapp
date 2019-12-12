import { createAsyncAction, createAction } from 'typesafe-actions';
import { UpdateVaultData } from '../types';

export const CREATE_VAULT = '@vault/create';
export const updateVault = createAsyncAction(CREATE_VAULT, '@vault/create/success', '@vault/create/failure')<
    UpdateVaultData,
    any,
    string
>();

export const reset = createAction('@vault/reset');
