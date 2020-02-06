import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { GovernanceState, ProposalData } from '@/types/store';

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
