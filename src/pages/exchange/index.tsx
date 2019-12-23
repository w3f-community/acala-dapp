import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';

import Title from '@/components/page/title';
import { useTranslate } from '@/hooks/i18n';
import Page from '@/components/page';
import TxStatus from '@/components/tx-status';
import actions from '@/store/actions';
import { DEX_TOKENS, STABLE_COIN } from '@/config';
import FixedU128 from '@/utils/fixed_u128';
import { Form } from '@/hooks/form';

import { formContext } from './components/context';
import ExchangeBar from './components/exchange-bar';

const defaultFormData = {
    payAsset: {
        value: STABLE_COIN,
    },
    pay: {
        value: FixedU128.fromNatural(0),
    },
    receiveAsset: {
        value: DEX_TOKENS[1],
    },
    receive: {
        value: FixedU128.fromNatural(0),
    },
};

const Exchange: React.FC = () => {
    const { t } = useTranslate();
    const dispatch = useDispatch();

    useEffect(() => {
        // fetch dex liquidity pool
        dispatch(actions.dex.fetchDexLiquidityPool.request(DEX_TOKENS));
        // fetch account assets balance
        dispatch(actions.account.fetchAssetsBalance.request(DEX_TOKENS));
    }, [dispatch]);

    return (
        <Form context={formContext} data={defaultFormData}>
            <Page padding="0 55px">
                <Title>{t('Exchange')}</Title>
                <ExchangeBar />
            </Page>
        </Form>
    );
};

export default Exchange;
