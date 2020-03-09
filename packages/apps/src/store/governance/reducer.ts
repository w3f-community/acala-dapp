import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { GovernanceState } from '@honzon-platform/apps/types/store';

const initialState: GovernanceState = {
    proposals: [],
    council: [],
};

export default createReducer(initialState)
    .handleAction(actions.fetchProposals.success, (state, action) => ({
        ...state,
        proposals: action.payload,
    }))
    .handleAction(actions.fetchCouncil.success, (state, action) => ({
        ...state,
        council: action.payload,
    }));
