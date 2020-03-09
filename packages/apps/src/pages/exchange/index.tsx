import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import Page from '@honzon-platform/apps/components/page';
import actions from '@honzon-platform/apps/store/actions';
import { DEX_TOKENS, STABLE_COIN } from '@honzon-platform/apps/config';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import { Form } from '@honzon-platform/apps/hooks/form';

import { formContext } from './components/context';
import ExchangeBar from './components/exchange-bar';
import TransferHistory from '../wallet/components/transfer-history';

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
            <Page title={t('Exchange')} style={{ maxWidth: 1200, paddingTop: 40 }}>
                <ExchangeBar />
            </Page>
        </Form>
    );
};

export default Exchange;
