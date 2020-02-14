import React, { useState, ChangeEventHandler, useEffect, ReactElement, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
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
import { statusSelector } from '@/store/loan/selectors';
import { specPriceSelector, specCdpTypeSelector } from '@/store/chain/selectors';
import FixedU128 from '@/utils/fixed_u128';
import {
    debitToUSD,
    calcCollateralRatio,
    collateralToUSD,
    calcCanGenerater,
    calcLiquidationPrice,
    calcRequiredCollateral,
    stableCoinToDebit,
} from '@/utils/loan';
import { specUserLoanSelector } from '@/store/loan/selectors';
import { specBalanceSelector } from '@/store/account/selectors';
import { NumberInput } from '@/components/number-input';

export type ActionType = 'any' | 'payback' | 'generate' | 'deposit' | 'withdraw';

const ZERO = FixedU128.fromNatural(0);

const useInputStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
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
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.secondary.main),
    },
}))(Button);

const SDialog = withStyles((theme: Theme) => ({
    root: {
    },
    paper: {
        minWidth: 280,
        maxWidth: 280,
        padding: theme.spacing(4),
    },
}))(Dialog);

const SDialogTitle = withStyles((theme: Theme) => ({
    root: {
        ...createTypography(17, 24, 500, 'Roboto', theme.palette.common.black),
    },
}))(DialogTitle);

const DialogButton = withStyles((theme: Theme) => ({
    root: { },
}))(Button);

const DialogListItemText = withStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    primary: {
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
    },
    secondary: {
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.secondary.main),
    },
}))(ListItemText);

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
    const userLoan = useSelector(specUserLoanSelector(current));
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
        if (cdpType && userLoan && init.current === false) {
            const debitAmount = debitToUSD(userLoan.debit, cdpType.debitExchangeRate, stableCoinPrice);

            setBorrowed(debitAmount);
            setCollateralRatio(
                calcCollateralRatio(
                    collateralToUSD(userLoan.collateral, collateralPrice),
                    debitToUSD(userLoan.debit, cdpType.debitExchangeRate, stableCoinPrice),
                ),
            );
            setLiquidationPrice(
                calcLiquidationPrice(
                    debitToUSD(userLoan.debit, cdpType.debitExchangeRate, stableCoinPrice),
                    cdpType.liquidationRatio,
                ),
            );
            init.current = true;
        }
    }, [cdpType, userLoan, stableCoinPrice, collateralPrice]);

    if (!cdpType || !userLoan) {
        return null;
    }

    // loan info
    const debitAmount = debitToUSD(userLoan.debit, cdpType.debitExchangeRate, stableCoinPrice);
    const collateralAmount = collateralToUSD(userLoan.collateral, collateralPrice);
    const canGenerate = calcCanGenerater(
        collateralAmount,
        debitAmount,
        cdpType.requiredCollateralRatio,
        stableCoinPrice,
    );
    const requiredCollateral = calcRequiredCollateral(debitAmount, cdpType.requiredCollateralRatio, collateralPrice);
    const ableWithdraw = userLoan.collateral.sub(requiredCollateral);

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
            max: debitAmount.toNumber(5),
            onChange: value => {
                setAmount(value);
                const newDeibtValue = debitAmount.sub(FixedU128.fromNatural(value));
                setBorrowed(newDeibtValue);
                setCollateralRatio(calcCollateralRatio(collateralAmount, newDeibtValue));
                setLiquidationPrice(calcLiquidationPrice(newDeibtValue, cdpType.liquidationRatio));
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                const debitAmount = stableCoinToDebit(FixedU128.fromNatural(amount), cdpType.debitExchangeRate);
                dispatch(
                    actions.loan.updateLoan.request({
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
            max: canGenerate.toNumber(5),
            onChange: value => {
                setAmount(value);
                const newDeibtValue = debitAmount.add(FixedU128.fromNatural(value));
                setBorrowed(newDeibtValue);
                setCollateralRatio(calcCollateralRatio(collateralAmount, newDeibtValue));
                setLiquidationPrice(calcLiquidationPrice(newDeibtValue, cdpType.liquidationRatio));
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                const debitAmount = stableCoinToDebit(FixedU128.fromNatural(amount), cdpType.debitExchangeRate);
                dispatch(
                    actions.loan.updateLoan.request({
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
            max: collateralbalance.toNumber(5),
            onChange: value => {
                setAmount(value);
                const newcollateralAmount = collateralToUSD(
                    userLoan.collateral.add(FixedU128.fromNatural(value)),
                    collateralPrice,
                );
                setCollateralRatio(calcCollateralRatio(newcollateralAmount, debitAmount));
                setLiquidationPrice(calcLiquidationPrice(debitAmount, cdpType.liquidationRatio));
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                dispatch(
                    actions.loan.updateLoan.request({
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
            max: ableWithdraw.toNumber(5),
            onChange: value => {
                setAmount(value);
                const newcollateralAmount = collateralToUSD(
                    userLoan.collateral.sub(FixedU128.fromNatural(value)),
                    collateralPrice,
                );
                setCollateralRatio(calcCollateralRatio(newcollateralAmount, debitAmount));
                setLiquidationPrice(calcLiquidationPrice(debitAmount, cdpType.liquidationRatio));
            },
            onConfirm: () => {
                if (!amount) {
                    return false;
                }
                dispatch(
                    actions.loan.updateLoan.request({
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
    max: number;
    error?: boolean;

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
    open,
    onChange,
    onConfirm,
    onClose,
}) => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const inputClasses = useInputStyles();
    const updateLoanStatus = useSelector(statusSelector('updateLoan'));
    const [defaultValue, setDefaultValue] = useState<number>(amount);

    // reset amount
    useEffect(() => {
        onChange(0);
        setDefaultValue(0);
    }, []);

    const handleInput: ChangeEventHandler<HTMLInputElement> = e => {
        // const value = Number(e.currentTarget.value);
        // onChange(value);
    };

    const handleMax = () => {
        setDefaultValue(max);
    };

    useEffect(() => {
        if (updateLoanStatus === 'success') {
            dispatch(actions.loan.reset());
            onClose && onClose();
        }
    }, [updateLoanStatus, dispatch, onClose]);

    return (
        <SDialog open={open} onClose={onClose}>
            <SDialogTitle disableTypography>
                <Grid container justify="space-between" alignItems="center">
                    <p>{title}</p>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </SDialogTitle>
            <DialogContent>
                <NumberInput
                    classes={{ root: inputClasses.root }}
                    min={0}
                    max={max}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    InputProps={{
                        placeholder: placeholder,
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
                    <DialogButton
                        variant="contained"
                        color="primary"
                        onClick={onConfirm}
                        disabled={updateLoanStatus !== 'none'}
                    >
                        {confirmBtnText}
                    </DialogButton>
                    <DialogButton variant="contained" color="secondary" onClick={onClose}>
                        {t('cancel')}
                    </DialogButton>
                </Grid>
                <Information disablePadding>
                    <ListItem disableGutters>
                        <DialogListItemText
                            primary={t('Borrowed aUSD')}
                            secondary={t('{{number}} {{asset}}', { number: formatBalance(borrowed), asset: 'aUSD' })}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <DialogListItemText
                            primary={t('New Collateral Ratio')}
                            secondary={formatRatio(collateralRatio)}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <DialogListItemText
                            primary={t('New Liquidation Price')}
                            secondary={formatPrice(liquidationPrice, '$')}
                        />
                    </ListItem>
                </Information>
            </DialogContent>
        </SDialog>
    );
};

export default ActionModal;
