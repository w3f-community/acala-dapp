import React, { FC, useEffect } from 'react';
import Page from '@/components/page';
import { useTranslate } from '@/hooks/i18n';
import { useDispatch } from 'react-redux';
import actions from '@/store/actions';
import { assets, airDropAssets } from '@/config';
import { AirDrop } from './components/airdrop';
import { Balance } from './components/balance';
import TransferHistory from './components/transfer-history';
import { Box } from '@material-ui/core';

const Wallet: FC = () => {
    const { t }= useTranslate();
    const dispatch = useDispatch();

    useEffect(() => {
        // fetch user asset balance
        dispatch(actions.account.fetchAssetsBalance.request(Array.from(assets.keys())));
        // fetch user airdrop
        dispatch(actions.account.fetchAirdrop.request(Array.from(airDropAssets.keys())));
        // load tx record
        dispatch(actions.app.loadTxRecord());
    }, []);


    return (
        <Page title={t('USER CENTER')} style={{ maxWidth: 1200 }}>
            <AirDrop />
            <Box padding={2} />
            <Balance />
            <Box padding={2} />
            <TransferHistory />
        </Page>
    );
}

export default Wallet;