import { createAsyncAction } from 'typesafe-actions';
import { ProposalData } from '@/types/store';

export const FETCH_PROPOSALS = '@governance/fetch_proposals';
export const fetchProposals = createAsyncAction(
    FETCH_PROPOSALS,
    '@governance/fetch_proposals/success',
    '@governance/fetch_proposals/failure',
)<unknown, ProposalData[], string>();

export const FETCH_COUNCIL = '@governance/fetch_council';
export const fetchCouncil = createAsyncAction(
    FETCH_COUNCIL,
    '@governance/fetch_council/success',
    '@governance/fetch_council/failure',
)<unknown, string[], string>();
