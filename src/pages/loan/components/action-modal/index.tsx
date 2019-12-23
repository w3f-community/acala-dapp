import React, { useState, ReactEventHandler, ChangeEventHandler, useEffect, ReactElement } from 'react';
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
    stableCoinToDebit,
    debitToStableCoin,
    calcCollateralRatio,
    collateralToStableCoin,
    calcCanGenerater,
    calcLiquidationPrice,
    calcRequiredCollateral,
} from '@/utils/vault';
import { specUserVaultSelector, specBalanceSelector } from '@/store/account/selectors';

export type ActionType = 'any' | 'payback' | 'generate' | 'deposit' | 'withdraw';

const ZERO = FixedU128.fromNatural(0);

const useStyles = makeStyles(() =>
    createStyles({
        information: {
            marginTop: 46,
        },
    }),
);

const useInputStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            ...createTypography(30, 32, 600, 'Roboto', theme.palette.common.black),
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
    const { action, current } = props;

    const { t } = useTranslate();
    const dispatch = useDispatch();
    const stableCoinPrice = useSelector(specPriceSelector(STABLE_COIN));
    const collateralPrice = useSelector(specPriceSelector(current));
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

    useEffect(() => {
        if (vault && userVault) {
            const debitValue = debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice);

            setBorrowed(debitValue);
            setCollateralRatio(
                calcCollateralRatio(
                    collateralToStableCoin(userVault.collateral, collateralPrice),
                    debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
                ),
            );
            setLiquidationPrice(
                calcLiquidationPrice(
                    debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
                    vault.requiredCollateralRatio,
                    userVault.collateral,
                ),
            );
        }
    }, []);

    if (!vault || !userVault) {
        return null;
    }

    const debitValue = debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice);
    const collateralVaule = collateralToStableCoin(userVault.collateral, collateralPrice);
    const canGenerate = calcCanGenerater(collateralVaule, debitValue, vault.requiredCollateralRatio);
    const requiredCollateral = calcRequiredCollateral(
        debitToStableCoin(userVault.debit, vault.debitExchangeRate, stableCoinPrice),
        vault.requiredCollateralRatio,
        collateralPrice,
    );
    const ableWithdraw = userVault.collateral.sub(requiredCollateral);

    const baseProps = {
        amount,
        borrowed,
        collateralRatio,
        liquidationPrice,
        ...props,
    };

    if (action === 'payback') {
        return createActionModal({
            title: t('Payback {{ asset}}', { asset: stableCoinAssetName }),
            confirmBtnText: t('Payback'),
            placeholder: `${debitValue.toNumber()} max`,
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
                const debitAmount = stableCoinToDebit(
                    FixedU128.fromNatural(amount),
                    vault.debitExchangeRate,
                    stableCoinPrice,
                );
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
            placeholder: `${canGenerate.toNumber()} max`,
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
                const debitAmount = stableCoinToDebit(
                    FixedU128.fromNatural(amount),
                    vault.debitExchangeRate,
                    stableCoinPrice,
                );
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
            placeholder: `${collateralbalance} max`,
            onChange: value => {
                if (FixedU128.fromNatural(value).isGreaterThan(collateralbalance)) {
                    return false;
                }
                const newCollateralVaule = collateralToStableCoin(
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
            placeholder: `${ableWithdraw} max`,
            onChange: value => {
                if (FixedU128.fromNatural(value).isGreaterThan(ableWithdraw)) {
                    return false;
                }
                const newCollateralVaule = collateralToStableCoin(
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
    borrowed: FixedU128;
    collateralRatio: FixedU128;
    liquidationPrice: FixedU128;
    amount: number;
    placeholder?: string;
    onChange?: (value: number) => void;
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

    const handleInput: ChangeEventHandler<HTMLInputElement> = e => {
        const value = Number(e.currentTarget.value);
        onChange && onChange(value);
    };

    useEffect(() => {
        if (updateVaultStatus === 'success') {
            dispatch(actions.vault.reset());
            onClose && onClose();
        }
    }, [updateVaultStatus]);

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
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
