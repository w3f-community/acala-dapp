import React from 'react';
import { Dialog, DialogContent, Button, DialogActions, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useTranslate } from '@/hooks/i18n';
import { POLKADOT_EXTENSIONS_ADDRESS } from '@/config';

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    open: boolean;
}
const NoExtension: React.FC<Props> = ({ open }) => {
    const { t } = useTranslate();
    const handleGetExtensionBtnClick = () => {
        window.open(POLKADOT_EXTENSIONS_ADDRESS);
    };
    return (
        <Dialog open={open} TransitionComponent={Transition}>
            <DialogContent>{t('No polkadot{.js} extension found, please install it first!')}</DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleGetExtensionBtnClick} color="primary">
                    GET IT
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoExtension;
