import React, { useEffect, useState } from 'react';
import { Paper, withStyles, Grid, Button, Theme, IconButton } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ExchangeArrows from '@/assets/exchange-arrows.svg';
import { useTranslate } from '@/hooks/i18n';
import AmountInput from './amount-input';
import FixedU128 from '@/utils/fixed_u128';
import { useDispatch, useSelector } from 'react-redux';
import actions from '@/store/actions';
import { specDexLiquidatePoolSelector, statusSelector } from '@/store/dex/selectors';
import { useForm } from '@/hooks/form';
import { formContext } from './context';
import { swapToTarget, swapToBase } from '@/utils/loan';
import { loadingSelector } from '@/store/loading/reducer';
import { SWAP_CURRENCY } from '@/store/dex/actions';
import { STABLE_COIN } from '@/config';
import useMobileMatch from '@/hooks/mobile-match';
import { specBalanceSelector } from '@/store/account/selectors';
import { formatBalance } from '@/components/formatter';

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

const DirectorButton = withStyles(() => ({
    root: {
        width: 53,
        height: 53,
    },
}))(IconButton);

const ZERO = FixedU128.fromNatural(0);

const ExchangeBar: React.FC = () => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const {
        data: { payAsset, pay, receiveAsset, receive },
        setValue,
        setError,
        clearError,
        checkVerify,
    } = useForm(formContext);

    const [lock, setLock] = useState<'pay' | 'receive' | null>(null);
    const receivePool = useSelector(specDexLiquidatePoolSelector(receiveAsset.value));
    const payPool = useSelector(specDexLiquidatePoolSelector(payAsset.value));
    const loading = useSelector(loadingSelector(SWAP_CURRENCY));
    const swapTxStatus = useSelector(statusSelector('swapCurrency'));
    const [payBalance] = useSelector(specBalanceSelector([payAsset.value, receiveAsset.value]));
    const match = useMobileMatch('sm');

    pay.validator = (value: FixedU128): string => {
        if (value.isLessThan(ZERO)) {
            return 'please enter positive number';
        }
        if (value.isZero()) {
            return 'please enter pay amount';
        }
        if (value.isGreaterThan(value)) {
            return `the max amount can pay is ${formatBalance(payBalance)}`;
        }
        return '';
    };

    receive.validator = (value: FixedU128): string => {
        if (value.isLessThan(ZERO)) {
            return 'please enter positive number';
        }
        if (value.isZero()) {
            return 'please enter receive amount';
        }
        if (receivePool && value.isGreaterThan(receivePool.pool.other)) {
            return 'the pool has no enough asset';
        }
        return '';
    };

    useEffect(() => {
        if (swapTxStatus === 'failure' || swapTxStatus === 'success') {
            setValue('pay', ZERO);
            setValue('receive', ZERO);
            dispatch(actions.dex.reset());
        }
    }, [swapTxStatus, dispatch]);

    useEffect(() => {
        if (!payPool || !receivePool || lock === 'receive') {
            setLock('pay');
            return;
        }

        let payAmount = pay.value;
        if (payAsset.value !== STABLE_COIN) {
            // other -> base
            payAmount = swapToTarget(payAmount, payPool.pool.base, payPool.pool.other);
        }
        if (receiveAsset.value === STABLE_COIN) {
            setValue('receive', payAmount);
        } else {
            // base -> other
            const receiveByCurrent = swapToTarget(payAmount, receivePool.pool.other, receivePool.pool.base);
            setValue('receive', receiveByCurrent);
        }
    }, [pay.value, payAsset.value, receiveAsset.value]);

    useEffect(() => {
        if (!payPool || !receivePool || lock === 'pay') {
            return;
        }

        let payAmount = receive.value;
        if (receiveAsset.value !== STABLE_COIN) {
            payAmount = swapToBase(payAmount, receivePool.pool.other, receivePool.pool.base);
        }

        if (payAsset.value === STABLE_COIN) {
            setValue('pay', payAmount);
        } else {
            const payByCurrent = swapToBase(payAmount, payPool.pool.base, payPool.pool.other);
            setValue('pay', payByCurrent);
        }
    }, [receive.value]);

    useEffect(() => {
        // verify pay and receive value
        if (lock) {
            setError('pay', pay.validator(pay.value));
            setError('receive', receive.validator(receive.value));
        }
    }, [receive.value, pay.value]);

    if (!receivePool || !payPool) {
        return <Skeleton variant="rect" height={118} />;
    }

    const handleSwapDirection = () => {
        const payAssetId = payAsset.value;
        const receiveAssetId = receiveAsset.value;

        // swap
        setValue('payAsset', receiveAssetId);
        setValue('receiveAsset', payAssetId);
        // clear
        setValue('pay', ZERO);
        setValue('receive', ZERO);
        setError('pay', '');
        setError('receive', '');
        // clear lock
        setLock(null);
    };

    const handlePayChange = (value: number) => {
        const target = FixedU128.fromNatural(value);
        setValue('pay', target);
        setLock('pay');
    };

    const handlePayAssetChange = (asset: number) => {
        setValue('payAsset', asset);
        setLock('pay');
    };

    const handleReceiveChange = (value: number) => {
        const target = FixedU128.fromNatural(value);
        setValue('receive', target);
        setLock('receive');
    };

    const handleReceiveAssetChange = (asset: number) => {
        setValue('receiveAsset', asset);
        setLock('pay');
    };

    const handleExchangeBtnClick = () => {
        // reset lock
        setLock(null);
        checkVerify(() => {
            dispatch(
                actions.dex.swapCurrency.request({
                    supply: { asset: payAsset.value, balance: pay.value },
                    target: { asset: receiveAsset.value, balance: receive.value },
                }),
            );
        });
    };

    return (
        <SPaper square={true} elevation={1}>
            <Grid container alignItems="center" wrap={match ? 'wrap' : 'nowrap'} spacing={match ? 0 : 10}>
                <Grid item xs={match ? 12 : 'auto'}>
                    <AmountInput
                        title={t('Pay with')}
                        asset={payAsset.value}
                        value={pay.value.toNumber(4)}
                        error={pay.error}
                        onValueChange={handlePayChange}
                        onAssetChange={handlePayAssetChange}
                    />
                </Grid>
                <Grid item xs={match ? 12 : 'auto'} style={match ? { margin: '26px 0' } : {}}>
                    <DirectorButton onClick={handleSwapDirection}>
                        <img src={ExchangeArrows} alt="arrows" />
                    </DirectorButton>
                </Grid>
                <Grid item xs={match ? 12 : 'auto'}>
                    <AmountInput
                        title={t('Receive')}
                        value={receive.value.toNumber(4)}
                        error={receive.error}
                        asset={receiveAsset.value}
                        onValueChange={handleReceiveChange}
                        onAssetChange={handleReceiveAssetChange}
                    />
                </Grid>
                <Grid item xs={match ? 12 : 'auto'}>
                    <Grid container justify="center">
                        <SButton
                            variant="contained"
                            color="primary"
                            onClick={handleExchangeBtnClick}
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
