import React from 'react';
import { Paper, withStyles, Grid, Button, Theme } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ExchangeArrows from '@/assets/exchange-arrows.svg';
import { useTranslate } from '@/hooks/i18n';
import AmountInput from './amount-input';
import FixedU128 from '@/utils/fixed_u128';
import { useDispatch, useSelector } from 'react-redux';
import actions from '@/store/actions';
import { specDexLiquidatePoolSelector } from '@/store/dex/selectors';
import { useForm } from '@/hooks/form';
import { formContext } from './context';
import { swapToOther, swapToBase } from '@/utils/vault';
import { loadingSelector } from '@/store/loading/reducer';
import { SWAP_CURRENCY } from '@/store/dex/actions';
import { STABLE_COIN } from '@/config';
import useMobileMatch from '@/hooks/mobile-match';

const SPaper = withStyles((theme: Theme) => ({
    root: {
        padding: '100px 64px 45px',
        [theme.breakpoints.down('sm')]: {
            padding: '52px 30px',
        },
    },
}))(Paper);

const SButton = withStyles((theme: Theme) => ({
    root: {
        width: 162,
        [theme.breakpoints.down('sm')]: {
            marginTop: 61,
        },
    },
}))(Button);

const ExchangeBar: React.FC = () => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const {
        data: { payAsset, pay, receiveAsset, receive },
        setValue,
    } = useForm(formContext);

    const receivePool = useSelector(specDexLiquidatePoolSelector(receiveAsset.value));
    const payPool = useSelector(specDexLiquidatePoolSelector(payAsset.value));
    const loading = useSelector(loadingSelector(SWAP_CURRENCY));
    const match = useMobileMatch('sm');

    if (!receivePool || !payPool) {
        return <Skeleton variant="rect" height={118} />;
    }

    const handlePayChange = (asset: number, value: number) => {
        const target = FixedU128.fromNatural(value);
        setValue('pay', target);
        setValue('payAsset', asset);

        let payAmount = target;
        if (asset !== STABLE_COIN) {
            // other -> base
            payAmount = swapToBase(target, payPool.pool.other, payPool.pool.base, false);
        }
        // base -> other
        const receiveByCurrent = swapToOther(payAmount, receivePool.pool.other, receivePool.pool.base, false);
        setValue('receive', receiveByCurrent);
    };

    const handleReceiveChange = (asset: number, value: number) => {
        const target = FixedU128.fromNatural(value);

        setValue('receive', target);
        setValue('receiveAsset', asset);

        let receiveBaseAmount = target;
        if (asset !== STABLE_COIN) {
            receiveBaseAmount = swapToBase(target, receivePool.pool.other, receivePool.pool.base, true);
        }

        if (payAsset.value === STABLE_COIN) {
            setValue('pay', receiveBaseAmount);
        } else {
            const payByCurrent = swapToOther(
                receiveBaseAmount, // new pay pool.pool.base amount
                payPool.pool.other,
                payPool.pool.base,
                false,
            );
            setValue('pay', payByCurrent);
        }
    };

    const handleExchangeBtcClick = () => {
        dispatch(
            actions.dex.swapCurrency.request({
                supply: { asset: payAsset.value, balance: pay.value },
                target: { asset: receiveAsset.value, balance: receive.value },
            }),
        );
    };

    return (
        <SPaper square={true} elevation={1}>
            <Grid container alignItems="center" wrap={match ? 'wrap' : 'nowrap'} spacing={match ? 0 : 10}>
                <Grid item xs={match ? 12 : 'auto'}>
                    <AmountInput
                        title={t('Pay with')}
                        defaultAsset={payAsset.value}
                        onChange={handlePayChange}
                        value={pay.value.toNumber()}
                    />
                </Grid>
                <Grid item xs={match ? 12 : 'auto'} style={match ? { margin: '26px 0' } : {}}>
                    <img src={ExchangeArrows} alt="arrows" />
                </Grid>
                <Grid item xs={match ? 12 : 'auto'}>
                    <AmountInput
                        title={t('Receive')}
                        value={receive.value.toNumber()}
                        defaultAsset={receiveAsset.value}
                        onChange={handleReceiveChange}
                    />
                </Grid>
                <Grid item xs={match ? 12 : 'auto'}>
                    <Grid container justify="center">
                        <SButton
                            variant="contained"
                            color="primary"
                            onClick={handleExchangeBtcClick}
                            disabled={loading}
                        >
                            Exchange
                        </SButton>
                    </Grid>
                </Grid>
            </Grid>
        </SPaper>
    );
};

export default ExchangeBar;
