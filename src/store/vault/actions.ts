import { createAsyncAction } from 'typesafe-actions';
import { UpdateVaultData } from '../types';

export const CREATE_VAULT = '@valut/create';
export const updateVault = createAsyncAction(CREATE_VAULT, '@vault/create/success', '@vault/create/failure')<
    UpdateVaultData,
    any,
    string
>();
