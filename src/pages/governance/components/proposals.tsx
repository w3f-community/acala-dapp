import React, { FC } from 'react';
import { useTranslate } from '@/hooks/i18n';
import { ProposalCard } from './proposal-card';
import { ProposalData } from '@/types/store';
import { useSelector } from 'react-redux';
import { proposalSelector } from '@/store/governance/selectors';

export const Proposals: FC = () => {
    const { t } = useTranslate();
    const pendingProposals: ProposalData[] = useSelector(proposalSelector);
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
