import { Selector, ProposalData } from '@/types/store';

export const proposalSelector: Selector<ProposalData[]> = state => state.governance.proposals;

export const councilSelector: Selector<string[]> = state => state.governance.council;
