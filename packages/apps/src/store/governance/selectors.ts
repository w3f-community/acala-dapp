import { Selector, ProposalData } from '@honzon-platform/apps/types/store';

export const proposalSelector: Selector<ProposalData[]> = state => state.governance.proposals;

export const councilSelector: Selector<string[]> = state => state.governance.council;
