import React from 'react';
import { Dialog, DialogProps } from '@material-ui/core';

export type ActionType = 'payback' | 'generate' | 'deposit' | 'withdraw';

export type ActionModalProps = Pick<DialogProps, 'open'> & {
    action: ActionType;
};

const ActionModal: React.FC<ActionModalProps> = ({ action, open }) => {
    return <Dialog open={open}>hello</Dialog>;
};

export default ActionModal;
