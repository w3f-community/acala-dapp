import React, { useState, ChangeEventHandler, useEffect, ReactElement, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    InputAdornment,
    Button,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    createStyles,
    Box,
    Grid,
    IconButton,
    Theme,
    withStyles,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import CloseIcon from '@/components/svgs/close';
import { getAssetName } from '@/utils';
import { STABLE_COIN } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice, formatBalance, formatRatio } from '@/components/formatter';
import actions from '@/store/actions';
import { statusSelector } from '@/store/vault/selectors';
import { specPriceSelector, specCdpTypeSelector } from '@/store/chain/selectors';
import FixedU128 from '@/utils/fixed_u128';
import {
    USDToDebit,
    debitToUSD,
    calcCollateralRatio,
    collateralToUSD,
    calcCanGenerater,
    calcLiquidationPrice,
    calcRequiredCollateral,
    stableCoinToDebit,
    debitToStableCoin,
} from '@/utils/vault';
import { specUserVaultSelector } from '@/store/vault/selectors';
import { specBalanceSelector } from '@/store/account/selectors';

export type ActionType = 'any' | 'payback' | 'generate' | 'deposit' | 'withdraw';

const ZERO = FixedU128.fromNatural(0);

const useInputStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            ...createTypography(22, 32, 500, 'Roboto', theme.palette.common.black),
        },
        underline: {
            color: '#0123cc',
            background: '#0123cc',
            borderBottom: '#0123cc',
            '&::after': {
                borderBottom: '#0123cc',
            },
        },
    }),
);

const Information = withStyles(() => ({
    root: {
        marginTop: 26,
    },
}))(List);

const MaxButton = withStyles((theme: Theme) => ({
    root: {
        marginRight: 8,
        minWidth: 'auto',
        height: 'auto',
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.secondary.main),
    },
}))(Button);

const createActionModal: (option: BaseActionModalProps & ActionModalProps) => ReactElement = props => {
    return <BaseActionModal {...props} />;
};

export type ActionModalProps = {
    current: number;
    open: boolean;
    action: ActionType;
    onClose?: () => void;
    onConfirm?: () => void;
};

const ActionModal: React.FC<ActionModalProps> = props => {
    const init = useRef<boolean>(false);
    const { action, current, onClose } = props;
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const [stableCoinPrice, collateralPrice] = useSelector(specPriceSelector([STABLE_COIN, current]));
    const collateralbalance = useSelector(specBalanceSelector(current));
    const cdpType = useSelector(specCdpTypeSelector(current));
    const userVault = useSelector(specUserVaultSelector(current));
    const stableCoinAssetName = getAssetName(STABLE_COIN);
    const currentAssetName = getAssetName(current);
    const [amount, setAmount] = useState<number>(0);

    // information
    const [borrowed, setBorrowed] = useState<FixedU128>(ZERO);
    const [collateralRatio, setCollateralRatio] = useState<FixedU128>(ZERO);
    const [liquidationPrice, setLiquidationPrice] = useState<FixedU128>(ZERO);
    const _onClose = () => {
        onClose && onClose();
    };

    useEffect(() => {
        if (cdpType && userVault && init.current === false) {
            const debitAmount = debitToUSD(userVault.debit, cdpType.debitExchangeRate, stableCoinPrice);

            setBorrowed(debitAmount);
            setCollateralRatio(
                calcCollateralRatio(
                    collateralToUSD(userVault.collateral, collateralPrice),
                    debitToUSD(userVault.debit, cdpType.debitExchangeRate, stableCoinPrice),
                ),
            );
            setLiquidationPrice(
                calcLiquidationPrice(
                    debitToUSD(userVault.debit, cdpType.debitExchangeRate, stableCoinPrice),
                    cdpType.requiredCollateralRatio,
                    userVault.collateral,
                ),
            );
            init.current = true;
        }
    }, [cdpType, userVault, stableCoinPrice, collateralPrice]);

    if (!cdpType || !userVault) {
        return null;
    }

    // vault info
    const debitAmount = debitToUSD(userVault.debit, cdpType.debitExchangeRate, stableCoinPrice);
    const collateralAmount = collateralToUSD(userVault.collateral, collateralPrice);
    const canGenerate = calcCanGenerater(
        collateralAmount,
        debitAmount,
        cdpType.requiredCollateralRatio,
        stableCoinPrice,
    );
    const requiredCollateral = calcRequiredCollateral(debitAmount, cdpType.requiredCollateralRatio, collateralPrice);
    const ableWithdraw = userVault.collateral.sub(requiredCollateral);

    const baseProps = {
        ...props,
        amount,
        borrowed,
        collateralRatio,
        liquidationPrice,
        onClose: _onClose,
    };

    if (action === 'payback') {
        return createActionModal({
            title: t('Payback {{ asset}}', { asset: stableCoinAssetName }),
            confirmBtnText: t('Payback'),
            placeholder: `${formatBalance(debitAmount)} max`,
            max: debitAmount,
            startAdornment: stableCoinAssetName,
            onChange: value => {
                const _value = FixedU128.fromNatural(value)
                if (_value.isGreaterThan(debitAmount) || !_value.isEqualTo(debitAmount)) {
                    return false;
                }
                const newDeibtValue = debitAmount.sub(FixedU128.fromNatural(value));

                setAmount(value);
                setBorrowed(newDeibtValue);
                setCollateralRatio(calcCollateralRatio(collateralAmount, newDeibtValue));
                setLiquidationPrice(
                    calcLiquidationPrice(newDeibtValue, cdpType.requiredCollateralRatio, userVault.collateral),
                );
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                const debitAmount = stableCoinToDebit(FixedU128.fromNatural(amount), cdpType.debitExchangeRate);
                dispatch(
                    actions.vault.updateLoan.request({
                        asset: current,
                        collateral: ZERO,
                        debit: debitAmount.negated(),
                    }),
                );
            },
            ...baseProps,
        });
    }

    if (action === 'generate') {
        return createActionModal({
            title: t('Generate {{asset}}', { asset: stableCoinAssetName }),
            confirmBtnText: t('Generate'),
            placeholder: `${formatBalance(canGenerate)} max`,
            max: canGenerate,
            startAdornment: stableCoinAssetName,
            onChange: value => {
                const _value = FixedU128.fromNatural(value);
                if (_value.isGreaterThan(canGenerate) || !_value.isEqualTo(canGenerate)) {
                    return false;
                }
                const newDeibtValue = debitAmount.add(FixedU128.fromNatural(value));

                setAmount(value);
                setBorrowed(newDeibtValue);
                setCollateralRatio(calcCollateralRatio(collateralAmount, newDeibtValue));
                setLiquidationPrice(
                    calcLiquidationPrice(newDeibtValue, cdpType.requiredCollateralRatio, userVault.collateral),
                );
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                const debitAmount = stableCoinToDebit(FixedU128.fromNatural(amount), cdpType.debitExchangeRate);
                dispatch(
                    actions.vault.updateLoan.request({
                        asset: current,
                        collateral: ZERO,
                        debit: debitAmount,
                    }),
                );
            },
            ...baseProps,
        });
    }

    if (action === 'deposit') {
        return createActionModal({
            title: t('Disposit {{asset}}', { asset: currentAssetName }),
            confirmBtnText: t('Deposit'),
            placeholder: `${formatBalance(collateralbalance)} max`,
            max: collateralbalance,
            startAdornment: currentAssetName,
            onChange: value => {
                if (FixedU128.fromNatural(value).isGreaterThan(collateralbalance)) {
                    return false;
                }
                const newcollateralAmount = collateralToUSD(
                    userVault.collateral.add(FixedU128.fromNatural(value)),
                    collateralPrice,
                );

                setAmount(value);
                setCollateralRatio(calcCollateralRatio(newcollateralAmount, debitAmount));
                setLiquidationPrice(
                    calcLiquidationPrice(
                        debitAmount,
                        cdpType.requiredCollateralRatio,
                        userVault.collateral.add(FixedU128.fromNatural(value)),
                    ),
                );
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                dispatch(
                    actions.vault.updateLoan.request({
                        asset: current,
                        collateral: FixedU128.fromNatural(amount),
                        debit: ZERO,
                    }),
                );
            },
            ...baseProps,
        });
    }

    if (action === 'withdraw') {
        return createActionModal({
            title: t('Withdraw {{asset}}', { asset: currentAssetName }),
            confirmBtnText: t('Withdraw'),
            placeholder: `${formatBalance(ableWithdraw)} max`,
            max: ableWithdraw,
            startAdornment: currentAssetName,
            onChange: value => {
                if (FixedU128.fromNatural(value).isGreaterThan(ableWithdraw)) {
                    return false;
                }
                const newcollateralAmount = collateralToUSD(
                    userVault.collateral.sub(FixedU128.fromNatural(value)),
                    collateralPrice,
                );

                setAmount(value);
                setCollateralRatio(calcCollateralRatio(newcollateralAmount, debitAmount));
                setLiquidationPrice(
                    calcLiquidationPrice(
                        debitAmount,
                        cdpType.requiredCollateralRatio,
                        userVault.collateral.sub(FixedU128.fromNatural(value)),
                    ),
                );
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                dispatch(
                    actions.vault.updateLoan.request({
                        asset: current,
                        collateral: FixedU128.fromNatural(amount).negated(),
                        debit: ZERO,
                    }),
                );
            },
            ...baseProps,
        });
    }
    return null;
};

interface BaseActionModalProps {
    title: string;
    confirmBtnText: string;
    // input props
    amount: number;
    placeholder?: string;
    max: FixedU128;
    error?: boolean;
    startAdornment?: string;

    borrowed: FixedU128;
    collateralRatio: FixedU128;
    liquidationPrice: FixedU128;

    onChange: (value: number) => void;
    onConfirm?: () => void;
}

const BaseActionModal: React.FC<BaseActionModalProps & ActionModalProps> = ({
    title,
    confirmBtnText,
    borrowed,
    collateralRatio,
    liquidationPrice,
    amount,
    placeholder,
    max,
    startAdornment,
    open,
    onChange,
    onConfirm,
    onClose,
}) => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const inputClasses = useInputStyles();
    const updateLoanStatus = useSelector(statusSelector('updateLoan'));

    // reset amount
    useEffect(() => {
        onChange(0);
    }, []);

    const handleInput: ChangeEventHandler<HTMLInputElement> = e => {
        const value = Number(e.currentTarget.value);
        onChange(value);
    };

    const handleMax = () => {
        onChange(max.toNumber());
    };

    useEffect(() => {
        if (updateLoanStatus === 'success') {
            dispatch(actions.vault.reset());
            onClose && onClose();
        }
    }, [updateLoanStatus, dispatch, onClose]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Grid container justify="space-between" alignItems="center">
                    <p>{title}</p>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <TextField
                    type="number"
                    classes={{ root: inputClasses.root }}
                    InputProps={{
                        placeholder: placeholder,
                        value: !amount ? '' : amount,
                        onChange: handleInput,
                        classes: { root: inputClasses.root },
                        endAdornment: (
                            <InputAdornment position="start">
                                <MaxButton disableRipple size="small" onClick={handleMax}>
                                    max
                                </MaxButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Box paddingTop={4} />
                <Grid container justify="space-between">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onConfirm}
                        disabled={updateLoanStatus !== 'none'}
                    >
                        {confirmBtnText}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        {t('cancel')}
                    </Button>
                </Grid>
                <Information disablePadding>
                    <ListItem disableGutters>
                        <ListItemText
                            primary={t('Borrowed aUSD')}
                            secondary={t('{{number}} {{asset}}', { number: formatBalance(borrowed), asset: 'aUSD' })}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemText primary={t('New Collateral Ratio')} secondary={formatRatio(collateralRatio)} />
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemText
                            primary={t('New Liquidation Price')}
                            secondary={formatPrice(liquidationPrice, '$')}
                        />
                    </ListItem>
                </Information>
            </DialogContent>
        </Dialog>
    );
};

export default ActionModal;
