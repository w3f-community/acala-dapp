import React, { useEffect, useState, useCallback } from 'react';
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
import { accountListSelector } from '@/store/account/selectors';
import { selectAccount } from '@/store/account/actions';
import { formatAddress } from '@/utils';

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    open: boolean;
}
const NoExtension: React.FC<Props> = ({ open }) => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const accountList = useSelector(accountListSelector);
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
                <List>
                    {accountList.map((account, index) => (
                        <ListItem
                            button
                            onClick={selectHandlerGen(index)}
                            selected={index === selected}
                            key={`account-${account.address}`}
                        >
                            <ListItemText secondary={formatAddress(account)} />
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
