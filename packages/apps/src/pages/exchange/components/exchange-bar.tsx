import React, { useEffect, useState } from 'react';
import { Paper, withStyles, Grid, Button, Theme, IconButton } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ExchangeArrows from '@honzon-platform/apps/assets/exchange-arrows.svg';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import AmountInput from './amount-input';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import { useDispatch, useSelector } from 'react-redux';
import actions from '@honzon-platform/apps/store/actions';
import { specDexLiquidatePoolSelector, statusSelector } from '@honzon-platform/apps/store/dex/selectors';
import { useForm } from '@honzon-platform/apps/hooks/form';
import { formContext } from './context';
import { swapToTarget, swapToBase } from '@honzon-platform/apps/utils/loan';
import { loadingSelector } from '@honzon-platform/apps/store/loading/reducer';
import { SWAP_CURRENCY } from '@honzon-platform/apps/store/dex/actions';
import { STABLE_COIN } from '@honzon-platform/apps/config';
import useMobileMatch from '@honzon-platform/apps/hooks/mobile-match';
import { specBalanceSelector } from '@honzon-platform/apps/store/account/selectors';
import { formatBalance } from '@honzon-platform/apps/components/formatter';

const SPaper = withStyles((theme: Theme) => ({
    root: {
        padding: '80px 40px 40px 40px',
        [theme.breakpoints.down('sm')]: {
            padding: '52px 30px',
        },
    },
}))(Paper);

const SButton = withStyles((theme: Theme) => ({
    root: {
        width: 80,
        [theme.breakpoints.down('sm')]: {
            marginTop: 61,
        },
    },
}))(Button);

const DirectorButton = withStyles(() => ({
    root: {
        margin: '0 32px 0 32px',
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
        checkVerify,
    } = useForm(formContext);

    const [lock, setLock] = useState<'pay' | 'receive' | null>(null);
    const receivePool = useSelector(specDexLiquidatePoolSelector(receiveAsset.value));
    const payPool = useSelector(specDexLiquidatePoolSelector(payAsset.value));
    const loading = useSelector(loadingSelector(SWAP_CURRENCY));
    const swapTxStatus = useSelector(statusSelector('swapCurrency'));
    const [payBalance] = useSelector(specBalanceSelector([payAsset.value]));
    const match = useMobileMatch('sm');

    pay.validator = (value: FixedU128): string => {
        if (value.isLessThan(ZERO)) {
            return 'please enter positive number';
        }
        if (value.isZero()) {
            return 'please enter pay amount';
        }
        if (value.isGreaterThan(payBalance)) {
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
        if (receiveAsset.value === STABLE_COIN) {
            if (payPool && value.isGreaterThan(payPool.pool.base)) {
                return 'the pool has no enough asset';
            }
            return '';
        }
        if (receivePool && value.isGreaterThan(receivePool.pool.other)) {
            return 'the pool has no enough asset';
        }
        return '';
    };

    useEffect(() => {
        setValue('pay', ZERO);
        setValue('receive', ZERO);
    }, []);

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
        if (pay.value.isZero() && receive.value.isZero()) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return () => {};
        }
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
            <Grid container justify="space-between" alignItems="center" wrap={match ? 'wrap' : 'nowrap'}>
                <Grid item>
                    <Grid container wrap="nowrap">
                        <AmountInput
                            title={t('Pay with')}
                            asset={payAsset.value}
                            value={pay.value.toNumber(4)}
                            error={pay.error}
                            onValueChange={handlePayChange}
                            onAssetChange={handlePayAssetChange}
                        />
                        <DirectorButton onClick={handleSwapDirection}>
                            <img src={ExchangeArrows} alt="arrows" />
                        </DirectorButton>
                        <AmountInput
                            title={t('Receive')}
                            value={receive.value.toNumber(4)}
                            error={receive.error}
                            asset={receiveAsset.value}
                            onValueChange={handleReceiveChange}
                            onAssetChange={handleReceiveAssetChange}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <SButton variant="contained" color="primary" onClick={handleExchangeBtnClick} disabled={loading}>
                        Exchange
                    </SButton>
                </Grid>
            </Grid>
        </SPaper>
    );
};

export default ExchangeBar;
