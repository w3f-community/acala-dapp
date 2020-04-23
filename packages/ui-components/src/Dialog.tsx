import React, { FC, memo, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

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

const DialogPortal:FC<BareProps> = ({children}) => {
   /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
   const $body = document.querySelector('body')!;
   const $div = document.createElement('div');
 
   $div.classList.add(classes.mask);
 
   useEffect((): () => void => {
     $body.append($div);
 
     return (): void => { $body.removeChild($div); };
   }, [$body, $div]);
 
   return createPortal(children, $div); 
};

export const Dialog: FC<Props> = memo(({
  cancelText = 'Cancel',
  confirmText = 'Confrim',
  className,
  children,
  onCancel,
  onConfirm,
  title,
  visiable = true,
  action,
  showCancel = false 
}) => {
  if (!visiable) {
    return null;
  }

  return (
    <DialogPortal>
      <div className={
        clsx(
          classes.root,
          className,
          {
            [classes.visiable]: visiable
          }
        )
      }>
        { title ? <div className={classes.title}>{title}</div> : null }
        <div className={classes.content}>{children}</div>
        {
          action ? action : (
            <div className={classes.action}>
              { showCancel ? (
                <Button
                  size='small'
                  onClick={onCancel}
                >
                  {cancelText}
                </Button>
              ) : null }
              { onConfirm ? (
                <Button
                  size='small'
                  onClick={onConfirm}
                >
                  {confirmText}
                </Button>
              ) : null }
            </div>
          )
        }
      </div>
    </DialogPortal>
  );
});

Dialog.displayName = 'Dialog';
