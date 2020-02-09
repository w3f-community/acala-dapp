import React, { FC } from 'react';
import { useTranslate } from '@/hooks/i18n';
import { ProposalCard } from './proposal-card';
import { Box } from '@material-ui/core';
import { ProposalData } from '@/types/store';
import { useSelector } from 'react-redux';
import { proposalSelector } from '@/store/governance/selectors';

export const Proposals: FC = () => {
    const { t } = useTranslate();
    const pendingProposals: ProposalData[] = useSelector(proposalSelector);
    const approvedProposals: ProposalData[] = [];
    return (
        <>
            <ProposalCard
                header={t('Proposal')}
                count={pendingProposals.length}
                data={pendingProposals}
                showVote={false}
            />
        </>
    );
};
