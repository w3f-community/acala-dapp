import React, { FC, useState, useEffect } from 'react';
import { getAssetIcon, getAssetName } from '@honzon-platform/apps/utils';
import {
    Grid,
    withStyles,
    Typography,
    Theme,
    createStyles,
    makeStyles,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    Button,
    ListItemAvatar,
    ListItemText,
} from '@material-ui/core';
import { createTypography } from '@honzon-platform/apps/theme';
import downIcon from '@honzon-platform/apps/assets/chevron-down.svg';
import { assets } from '@honzon-platform/apps/config';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import CloseIcon from '@honzon-platform/apps/components/svgs/close';

const AssetName = withStyles((theme: Theme) => ({
    root: {
        minWidth: theme.spacing(6),
        marginLeft: 14,
        ...createTypography(18, 22, 500, 'Roboto', theme.palette.common.black),
    },
}))(Typography);

const SDialogTitle = withStyles((theme: Theme) => ({
    root: {
        cursor: 'pointer',
        padding: 0,
        ...createTypography(21, 22, 500, 'Roboto', theme.palette.common.black),
    },
}))(DialogTitle);

const SListItemText = withStyles((theme: Theme) => ({
    root: {
        marginLeft: 12,
    },
    primary: {
        ...createTypography(22, 32, 500, 'Roboto', theme.palette.common.black),
    },
    secondary: {
        ...createTypography(15, 22, 500, 'Roboto', theme.palette.secondary.main),
    },
}))(ListItemText);

const SListItemAvatar = withStyles(() => ({
    root: {
        minWidth: 47,
        height: 47,
        width: 'auto',
    },
}))(ListItemAvatar);

const SListItem = withStyles(() => ({
    root: {
        padding: '4px 0',
        alignItems: 'center',
        marginBottom: 8,
    },
}))(ListItem);

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            cursor: 'pointer',
            width: 'auto',
        },
        icon: {
            width: 32,
            height: 32,
        },
        paperRoot: {
            width: 355,
            minHeight: 584,
            padding: '51px 38px 51px 34px',
        },
        list: {
            marginBottom: 40,
        },
    }),
);

interface Props {
    defaultToken: number;
    data: number[];
    onChange: (token: number) => void;
}

const TokenSelect: FC<Props> = ({ defaultToken, data, onChange }) => {
    const classes = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const [asset, setAsset] = useState<number>(defaultToken);
    const [selected, setSelected] = useState<number>(defaultToken);

    const { t } = useTranslate();

    const ASSETS = data.map(key => Object.assign({}, { asset: key }, assets.get(key)));

    const openDialogHandler = () => setOpen(true);
    const closeDialogHandler = () => setOpen(false);
    const selectItemHandlerGen = (asset: number) => () => {
        setSelected(asset);
        onChange(asset);
    };

    useEffect(() => {
        setSelected(defaultToken);
        setAsset(defaultToken);
    }, [defaultToken]);

    const selectBtnHandler = () => {
        setOpen(false);
        if (!selected) {
            return false;
        }
        setAsset(selected);
    };

    return (
        <>
            <Grid container alignItems="center" className={classes.root} onClick={openDialogHandler}>
                <img src={getAssetIcon(asset)} className={classes.icon} alt={`token-${asset}`} />
                <AssetName>{getAssetName(asset)}</AssetName>
            </Grid>

            <Dialog
                open={open}
                onClose={closeDialogHandler}
                PaperProps={{
                    classes: { root: classes.paperRoot },
                }}
            >
                <SDialogTitle disableTypography={true} onClick={closeDialogHandler}>
                    <Grid container justify="space-between" alignItems="center">
                        <span>{t('Select Token')}</span>
                        <CloseIcon />
                    </Grid>
                </SDialogTitle>
                <DialogContent>
                    <List className={classes.list}>
                        {ASSETS.map(item => (
                            <SListItem
                                button
                                selected={item.asset === selected}
                                onClick={selectItemHandlerGen(item.asset)}
                                key={`token-selected-${item.asset}`}
                            >
                                <SListItemAvatar>
                                    <img
                                        src={item.icon}
                                        className="icon"
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </SListItemAvatar>
                                <SListItemText primary={item.name} secondary={item.fullName} />
                            </SListItem>
                        ))}
                    </List>
                    <Grid container>
                        <Button variant="contained" color="primary" onClick={selectBtnHandler}>
                            {t('Select')}
                        </Button>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TokenSelect;
