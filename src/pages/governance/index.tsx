import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Title from '@/components/page/title';
import { useTranslate } from '@/hooks/i18n';
import Page from '@/components/page';
import ProposalList from './components/proposal-list';

const Exchange: React.FC = () => {
    const { t } = useTranslate();

    return (
        <Page padding="0 55px">
            <Title>{t('Governance')}</Title>
            <Router>
                <Route path="/">
                    <ProposalList />
                </Route>
            </Router>
        </Page>
    );
};

export default Exchange;
