import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { GovernanceState, ProposalData } from '@/types/store';

const initialState: GovernanceState = {
    proposals: [],
};

export default createReducer(initialState).handleAction(actions.fetchProposals.success, (state, action) => ({
    ...state,
    proposals: action.payload,
}));
