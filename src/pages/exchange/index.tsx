import React from 'react';
import Title from '@/components/page/title';
import { useTranslate } from '@/hooks/i18n';
import Page from '@/components/page';
import ExchangeBar from './components/exchange-bar';

const Exchange: React.FC = () => {
    const { t } = useTranslate();

    return (
        <Page padding="0 55px">
            <Title>{t('Exchange')}</Title>
            <ExchangeBar />
        </Page>
    );
};

export default Exchange;
