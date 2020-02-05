import React, { useState, useEffect } from 'react';
import { useTranslate } from '@/hooks/i18n';
import Page from '@/components/page';
import { Tabs, TabsItem } from '@/components/tabs';
import { Proposals } from './components/proposals';
import { useDispatch } from 'react-redux';
import { fetchProposals } from '@/store/governance/actions';

type TabsType = 'proposal' | 'council' | string;

const Governance: React.FC = () => {
    const { t } = useTranslate();
    const [active, setActive] = useState<TabsType>('proposal')
    const dispatch = useDispatch();
    const tabsConfig: TabsItem[] = [
        {
            key: 'proposal',
            title: t('Proposal'),
            render: () => <Proposals />
        },
        {
            key: 'council',
            title: t('Council'),
            render: () => { return <p>council</p> }
        }
    ]
    const handleActive = (key: TabsType) => setActive(key)

    useEffect(() => {
        dispatch(fetchProposals.request({}))
    }, [dispatch])

    return (
        <Page title={t('Governance')} style={{ maxWidth: 900 }}>
            <Tabs active={active} config={tabsConfig} onChange={handleActive}/>
        </Page>
    );
};

export default Governance;