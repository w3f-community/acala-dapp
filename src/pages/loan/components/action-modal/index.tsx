import React from 'react';
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
    Theme,
    Box,
    Grid,
    IconButton,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import closeSVG from '@/assets/close.svg';
import Formatter, { formatBalance, formatPrice } from '@/components/formatter';

export type ActionType = 'any' | 'payback' | 'generate' | 'deposit' | 'withdraw';

const useDialogStyles = makeStyles(() =>
    createStyles({
        paper: {
            width: 356,
            borderRadius: 0,
            padding: '50px 34px 38px',
        },
    }),
);

const useInputStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
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

const useTitleStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: 0,
            ...createTypography(21, 22, 600, 'Roboto'),
        },
    }),
);

export interface ActionModalProps {
    open: boolean;
    action: ActionType;
    onClose?: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ action, open, onClose }) => {
    const { t } = useTranslate();
    const dialogClasses = useDialogStyles();
    const titleClasses = useTitleStyles();
    const inputClasses = useInputStyles();

    return (
        <Dialog open={open} onClose={onClose} classes={dialogClasses}>
            <DialogTitle classes={titleClasses} disableTypography>
                <Grid container justify="space-between" alignItems="center">
                    <p>{t('Payback aUSD')}</p>
                    <IconButton onClick={onClose}>
                        <img src={closeSVG} />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <TextField
                    classes={{ root: inputClasses.root }}
                    inputProps={{ classes: inputClasses }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <Box paddingTop={4} />
                <Grid container justify="space-between">
                    <Button variant="contained" color="primary">
                        {t('Payback')}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        {t('cancel')}
                    </Button>
                </Grid>
                <Box paddingTop={6} />
                <List disablePadding>
                    <ListItem disableGutters>
                        <ListItemText
                            primary={t('Borrowed aUSD')}
                            secondary={t('{{number}} {{asset}}', { number: 240, asset: 'aUSD' })}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemText
                            primary={t('aUSD Balance')}
                            secondary={t('{{number}} {{asset}}', { number: 899.44, asset: 'aUSD' })}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemText
                            primary={t('New Liquidation Ratio')}
                            secondary={t('{{number}} {{asset}}', {
                                number: formatPrice(899.44, '$'),
                                asset: 'ETH/aUSD',
                            })}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemText
                            primary={t('New Liquidation Price')}
                            secondary={<Formatter data={2.5944} type="ratio" suffix="%" />}
                        />
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default ActionModal;
