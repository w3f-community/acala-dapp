import React, { useState } from 'react';
import { Paper, withStyles, Grid, Button } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ExchangeArrows from '@/assets/exchange-arrows.svg';
import { useTranslate } from '@/hooks/i18n';
import AmountInput from './amount-input';
import FixedU128 from '@/utils/fixed_u128';
import { STABLE_COIN, DEX_TOKENS } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import actions from '@/store/actions';
import { specDexLiquidatePoolSelector } from '@/store/dex/selectors';
import { Form, useForm } from '@/hooks/form';
import { formContext } from './context';
import { calcReceive, calcPay } from '@/utils/vault';
import { loadingSelector } from '@/store/loading/reducer';
import { SWAP_CURRENCY } from '@/store/dex/actions';

const SPaper = withStyles(() => ({
    root: {
        padding: '100px 64px 45px',
    },
}))(Paper);

const SButton = withStyles(() => ({
    root: {
        width: 162,
    },
}))(Button);

const ExchangeBar: React.FC = () => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    // const [pay, setPay] = useState<DexSwapData>({ asset: STABLE_COIN, value: FixedU128.fromNatural(0) });
    // const [receive, setReceive] = useState<DexSwapData>({ asset: DEX_TOKENS[2], value: FixedU128.fromNatural(0) });
    const {
        data: { payAsset, pay, receiveAsset, receive },
        setValue,
    } = useForm(formContext);

    const receivePool = useSelector(specDexLiquidatePoolSelector(receiveAsset.value));
    const payPool = useSelector(specDexLiquidatePoolSelector(payAsset.value));
    const loading = useSelector(loadingSelector(SWAP_CURRENCY));

    if (!receivePool || !payPool) {
        return <Skeleton variant="rect" height={118} />;
    }

    const handlePayChange = (asset: number, value: number) => {
        const target = FixedU128.fromNatural(value);
        setValue('pay', target);
        setValue('payAsset', asset);
        setValue('receive', calcReceive(target, receivePool.pool[1], receivePool.pool[0]));
    };

    const handleReceiveChange = (asset: number, value: number) => {
        const target = FixedU128.fromNatural(value);
        setValue('receive', target);
        setValue('receiveAsset', asset);
        setValue('pay', calcPay(target, receivePool.pool[1], receivePool.pool[0]));
    };

    const handleExchangeBtcClick = () => {
        dispatch(
            actions.dex.swapCurrency.request({
                supply: { asset: payAsset.value, balance: pay.value },
                target: { asset: receiveAsset.value, balance: receive.value },
            }),
        );
    };

    console.log(loading);

    return (
        <SPaper square={true} elevation={1}>
            <Grid container alignItems="center" justify="space-between" wrap="nowrap">
                <AmountInput
                    title={t('Pay with')}
                    defaultAsset={payAsset.value}
                    onChange={handlePayChange}
                    value={pay.value.toNumber()}
                />
                <img src={ExchangeArrows} />
                <AmountInput
                    title={t('Receive')}
                    value={receive.value.toNumber()}
                    defaultAsset={receiveAsset.value}
                    onChange={handleReceiveChange}
                />
                <SButton variant="contained" color="primary" onClick={handleExchangeBtcClick}>
                    Exchange
                </SButton>
            </Grid>
        </SPaper>
    );
};

export default ExchangeBar;
