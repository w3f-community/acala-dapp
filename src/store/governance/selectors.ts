import { Selector, ProposalData } from '@/types/store';

export const proposalSelector: Selector<ProposalData[]> = state => {
    return state.governance.proposals
}