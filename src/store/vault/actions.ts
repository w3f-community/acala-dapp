import { createAsyncAction, createAction } from 'typesafe-actions';
import { UpdateVaultData } from '../types';

export const UPDATE_VAULT = '@vault/update_vault';
export const updateVault = createAsyncAction(
    UPDATE_VAULT,
    '@vault/update_vault/success',
    '@vault/update_vault/failure',
)<UpdateVaultData, any, string>();

export const reset = createAction('@vault/reset');

export const LOAD_TX_RECORD = '@vault/load_tx_record';
export const loadTxRecord = createAction(LOAD_TX_RECORD);
