import { createAsyncAction, createAction } from 'typesafe-actions';
import { UpdateVaultData, AssetList, UserVaultData } from '@/types/store';

export const UPDATE_VAULT = '@vault/update_vault';
export const updateVault = createAsyncAction(
    UPDATE_VAULT,
    '@vault/update_vault/success',
    '@vault/update_vault/failure',
)<UpdateVaultData, any, string>();

export const reset = createAction('@vault/reset');

export const LOAD_TX_RECORD = '@vault/load_tx_record';
export const loadTxRecord = createAction(LOAD_TX_RECORD);

export const FETCH_VAULTS = '@account/fetch_vaults';
export const fetchVaults = createAsyncAction(
    FETCH_VAULTS,
    '@account/fetch_vaults/success',
    '@account/fetch_vaults/failure',
)<AssetList, UserVaultData[], string>();
