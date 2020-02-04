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
import { specPriceSelector, specVaultSelector } from '@/store/chain/selectors';
import FixedU128 from '@/utils/fixed_u128';
import {
    USDToDebit,
    debitToUSD,
    calcCollateralRatio,
    collateralToUSD,
    calcCanGenerater,
    calcLiquidationPrice,
    calcRequiredCollateral,
} from '@/utils/vault';
import { specUserVaultSelector } from '@/store/vault/selectors';
import { specBalanceSelector } from '@/store/account/selectors'

export type ActionType = 'any' | 'payback' | 'generate' | 'deposit' | 'withdraw';

const ZERO = FixedU128.fromNatural(0);

const useStyles = makeStyles(() =>
    createStyles({
        information: {
            marginTop: 46,
        },
        maxBtn: {
            marginRight: 8,
            minWidth: 'auto',
            height: 'auto',
        }
    }),
);

const useInputStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            ...createTypography(30, 32, 500, 'Roboto', theme.palette.common.black),
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
    const vault = useSelector(specVaultSelector(current));
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
        if (vault && userVault && init.current === false) {
            const debitValue = debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice);

            setBorrowed(debitValue);
            setCollateralRatio(
                calcCollateralRatio(
                    collateralToUSD(userVault.collateral, collateralPrice),
                    debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
                ),
            );
            setLiquidationPrice(
                calcLiquidationPrice(
                    debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
                    vault.requiredCollateralRatio,
                    userVault.collateral,
                ),
            );
            init.current = true;
        }
    }, [vault, userVault, stableCoinPrice, collateralPrice]);

    if (!vault || !userVault) {
        return null;
    }

    // vault info
    const debitValue = debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice);
    const collateralVaule = collateralToUSD(userVault.collateral, collateralPrice);
    const canGenerate = calcCanGenerater(collateralVaule, debitValue, vault.requiredCollateralRatio);
    const requiredCollateral = calcRequiredCollateral(
        debitToUSD(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
        vault.requiredCollateralRatio,
        collateralPrice,
    );
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
            placeholder: `${formatBalance(debitValue)} max`,
            max: debitValue,
            startAdornment: stableCoinAssetName,
            onChange: value => {
                if (FixedU128.fromNatural(value).isGreaterThan(debitValue)) {
                    return false;
                }
                const newDeibtValue = debitValue.sub(FixedU128.fromNatural(value));

                setAmount(value);
                setBorrowed(newDeibtValue);
                setCollateralRatio(calcCollateralRatio(collateralVaule, newDeibtValue));
                setLiquidationPrice(
                    calcLiquidationPrice(newDeibtValue, vault.requiredCollateralRatio, userVault.collateral),
                );
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                const debitAmount = USDToDebit(FixedU128.fromNatural(amount), vault.debitExchangeRate, stableCoinPrice);
                dispatch(
                    actions.vault.updateVault.request({
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
                if (FixedU128.fromNatural(value).isGreaterThan(canGenerate)) {
                    return false;
                }
                const newDeibtValue = debitValue.add(FixedU128.fromNatural(value));

                setAmount(value);
                setBorrowed(newDeibtValue);
                setCollateralRatio(calcCollateralRatio(collateralVaule, newDeibtValue));
                setLiquidationPrice(
                    calcLiquidationPrice(newDeibtValue, vault.requiredCollateralRatio, userVault.collateral),
                );
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                const debitAmount = USDToDebit(FixedU128.fromNatural(amount), vault.debitExchangeRate, stableCoinPrice);
                dispatch(
                    actions.vault.updateVault.request({
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
                const newCollateralVaule = collateralToUSD(
                    userVault.collateral.add(FixedU128.fromNatural(value)),
                    collateralPrice,
                );

                setAmount(value);
                setCollateralRatio(calcCollateralRatio(newCollateralVaule, debitValue));
                setLiquidationPrice(
                    calcLiquidationPrice(
                        debitValue,
                        vault.requiredCollateralRatio,
                        userVault.collateral.add(FixedU128.fromNatural(value)),
                    ),
                );
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                dispatch(
                    actions.vault.updateVault.request({
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
                const newCollateralVaule = collateralToUSD(
                    userVault.collateral.sub(FixedU128.fromNatural(value)),
                    collateralPrice,
                );

                setAmount(value);
                setCollateralRatio(calcCollateralRatio(newCollateralVaule, debitValue));
                setLiquidationPrice(
                    calcLiquidationPrice(
                        debitValue,
                        vault.requiredCollateralRatio,
                        userVault.collateral.sub(FixedU128.fromNatural(value)),
                    ),
                );
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                dispatch(
                    actions.vault.updateVault.request({
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
    max: FixedU128,
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
    const classes = useStyles();
    const inputClasses = useInputStyles();
    const updateVaultStatus = useSelector(statusSelector('updateVault'));

    // reset amount
    useEffect(() => { onChange(0) }, [])

    const handleInput: ChangeEventHandler<HTMLInputElement> = e => {
        const value = Number(e.currentTarget.value);
        onChange(value);
    };

    const handleMax = () => { onChange(max.toNumber()) };

    useEffect(() => {
        if (updateVaultStatus === 'success') {
            dispatch(actions.vault.reset());
            onClose && onClose();
        }
    }, [updateVaultStatus, dispatch, onClose]);

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
                        endAdornment: (
                            <InputAdornment position="start">
                                <Button disableRipple className={classes.maxBtn} size="small" onClick={handleMax}>max</Button>
                                {startAdornment}
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
                        disabled={updateVaultStatus !== 'none'}
                    >
                        {confirmBtnText}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        {t('cancel')}
                    </Button>
                </Grid>
                <List disablePadding className={classes.information}>
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
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default ActionModal;
