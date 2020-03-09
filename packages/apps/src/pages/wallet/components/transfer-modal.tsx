import React, { FC, useState, ChangeEventHandler, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Grid,
    withStyles,
    Theme,
    makeStyles,
    createStyles,
} from '@material-ui/core';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import { NumberInput } from '@honzon-platform/apps/components/number-input';
import { createTypography } from '@honzon-platform/apps/theme';
import { useSelector, useDispatch } from 'react-redux';
import { specBalanceSelector, transferStatusSelector } from '@honzon-platform/apps/store/account/selectors';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import { getAssetName } from '@honzon-platform/apps/utils';
import actions from '@honzon-platform/apps/store/actions';
import Keyring from '@polkadot/keyring';

const SDialog = withStyles((theme: Theme) => ({
    root: {},
    paper: {
        minWidth: 280,
        maxWidth: 280,
        padding: theme.spacing(4),
    },
}))(Dialog);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            marginBottom: theme.spacing(2),
            width: '100%',
            ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
        },
        label: {
            ...createTypography(15, 22, 500, 'Roboto', theme.palette.common.black),
        },
        bottom: {
            marginTop: theme.spacing(4),
        },
    }),
);

interface Props {
    asset: number;
    open: boolean;
    onClose: () => void;
}

export const TransferModal: FC<Props> = ({ asset, open = false, onClose }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    const balance = useSelector(specBalanceSelector(asset));
    const transferStatus = useSelector(transferStatusSelector);
    const dispatch = useDispatch();
    const [amount, setAmount] = useState<number>(0);
    const [account, setAccount] = useState<string>('');
    const [accountError, setAccountError] = useState<string>('');
    const [amountError, setAmountError] = useState<string>('');

    useEffect(() => {
        if (transferStatus === 'success') {
            onClose();
            dispatch(actions.account.reset());
        }
    }, [dispatch, transferStatus]);

    const reset = () => {
        // reset default
        setAmount(0);
        setAccount('');
        setAccountError('');
        setAmountError('');
    };

    const onAccountInput: ChangeEventHandler<HTMLInputElement> = event => {
        const value = event.target.value;
        const keyring = new Keyring();
        try {
            keyring.encodeAddress(keyring.decodeAddress(value));
            setAccountError('');
            setAccount(value);
        } catch (e) {
            setAccountError('Please enter validate account address');
        }
    };
    const onAmountInput = (value: number) => {
        if (FixedU128.fromNatural(value).isGreaterThan(balance)) {
            setAmountError(`Max to transfer is ${balance.toNumber(2, 2)} `);
            return false;
        }
        setAmountError('');
        setAmount(value);
    };
    const handleTransfer = () => {
        if (amountError || accountError) {
            return false;
        }
        dispatch(
            actions.account.transfer.request({
                account: account,
                amount: FixedU128.fromNatural(amount),
                asset: asset,
            }),
        );
    };

    return (
        <SDialog open={true} onClose={onClose}>
            <DialogTitle>{t('Transfer {{asset}}', { asset: getAssetName(asset) })}</DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <TextField
                        onChange={onAccountInput}
                        error={!!accountError}
                        autoFocus={true}
                        label={t('Account')}
                        InputProps={{
                            classes: { root: classes.input },
                        }}
                        helperText={accountError}
                        InputLabelProps={{
                            classes: { root: classes.label },
                        }}
                    />
                    <NumberInput
                        style={{ marginTop: 10 }}
                        label={t('Amount')}
                        InputProps={{
                            classes: { root: classes.input },
                        }}
                        error={amountError}
                        onChange={onAmountInput}
                        min={0}
                        InputLabelProps={{ classes: { root: classes.label } }}
                    />
                </Grid>
                <Grid container justify="space-between" className={classes.bottom}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTransfer}
                        disabled={!!amountError || !!accountError || transferStatus === 'pending'}
                    >
                        {t('Transfer')}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                </Grid>
            </DialogContent>
        </SDialog>
    );
};
