import React from 'react';
import { Dialog, DialogContent, Button, DialogActions, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useTranslate } from '@/hooks/i18n';

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    open: boolean;
}
const NoAccount: React.FC<Props> = ({ open }) => {
    const { t } = useTranslate();

    return (
        <Dialog open={open} TransitionComponent={Transition}>
            <DialogContent>
                {t('No account found, please add account in your wallet extension or unlock it!')}
            </DialogContent>
            <DialogActions>
                <Button color="primary">Retry</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoAccount;
