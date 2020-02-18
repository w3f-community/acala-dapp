import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
    Slide,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useTranslate } from '@/hooks/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { accountStoreSelector } from '@/store/account/selectors';
import { selectAccount } from '@/store/account/actions';
import { withStyles } from '@material-ui/styles';
import { createTypography } from '@/theme';

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddressItem = withStyles(() => ({
    secondary: {
        ...createTypography(15, 20, 500, 'Roboto'),
    },
}))(ListItemText);

interface Props {
    open: boolean;
}
const NoExtension: React.FC<Props> = ({ open }) => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const [accountList] = useSelector(accountStoreSelector(['accountList']));
    const [selected, setSelected] = useState<number>(0);

    // if there is only one account, don't show select view
    useEffect(() => {
        if (accountList.length === 1) {
            dispatch(selectAccount.request(0));
        }
    }, [accountList, dispatch]);

    if (accountList.length <= 1) {
        return null;
    }

    const confirmHandler = () => {
        dispatch(selectAccount.request(selected));
    };

    const selectHandlerGen = (index: number) => () => setSelected(index);

    return (
        <Dialog open={open} TransitionComponent={Transition}>
            <DialogTitle>{t('Select Account')}</DialogTitle>
            <DialogContent>
                <List disablePadding>
                    {accountList.map((account, index) => (
                        <ListItem
                            button
                            onClick={selectHandlerGen(index)}
                            selected={index === selected}
                            key={`account-${account.address}`}
                        >
                            <ListItemText primary={account.address} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={confirmHandler}>
                    {t('Confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoExtension;
