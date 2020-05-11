import React, { FC, memo, ReactNode, createRef } from 'react';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';


import { BareProps } from './types';
import classes from './Dialog.module.scss';
import { Button } from './Button';
import clsx from 'clsx';

interface Props extends BareProps {
  visiable: boolean;
  title?: ReactNode;
  action?: ReactNode;
  confirmText?: string | null;
  cancelText?: string | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export const Dialog: FC<Props> = memo(({
  action,
  cancelText = 'Cancel',
  children,
  className,
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  showCancel = false,
  title,
  visiable = true
}) => {
  const $div = createRef<HTMLDivElement>();

  return (
    <Modal
        disableEnforceFocus
        disableAutoFocus
        open={visiable}
        className={classes.mask}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500, }}
        container={$div.current}
      >
      <Fade in={visiable}>
        <div className={
          clsx(
            classes.root,
            className,
            {
              [classes.visiable]: visiable
            }
          )
        }>
          {title ? <div className={classes.title}>{title}</div> : null}
          <div className={classes.content}>{children}</div>
          <div className={classes.action}>
            {
              action || (
                <>
                  {showCancel ? (
                    <Button
                      onClick={onCancel}
                      size='small'
                    >
                      {cancelText}
                    </Button>
                  ) : null}
                  {onConfirm ? (
                    <Button
                      color='primary'
                      onClick={onConfirm}
                      size='small'
                    >
                      {confirmText}
                    </Button>
                  ) : null}
                </>
              )
            }
          </div>
        </div>
      </Fade>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';
