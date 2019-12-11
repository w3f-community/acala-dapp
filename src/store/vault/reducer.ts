import { createReducer } from 'typesafe-actions';
import { UserState, VaultState } from '../types';
import * as actions from './actions';

const initialState: VaultState = {
    updateVaultStatus: 'none',
};

export default createReducer(initialState)
    .handleAction(actions.updateVault.request, () => ({
        ...initialState,
        updateVaultStatus: 'pending',
    }))
    .handleAction(actions.updateVault.success, () => ({
        ...initialState,
        updateVaultStatus: 'success',
    }));
