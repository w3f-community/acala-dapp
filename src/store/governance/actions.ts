import { createAsyncAction } from 'typesafe-actions';
import { ProposalData } from '@/types/store';

export const FETCH_PROPOSALS = '@governance/fetch_proposals';
export const fetchProposals = createAsyncAction(
    FETCH_PROPOSALS,
    '@governance/fetch_proposals/success',
    '@governance/fetch_proposals/failure',
)<{}, ProposalData[], string>();
