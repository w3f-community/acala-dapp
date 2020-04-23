import React, { FC, memo, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { BareProps } from './types';
import classes from './Dialog.module.scss';
import { Button } from './Button';

interface Props extends BareProps {
  visiable: boolean;
  title: ReactNode;
  content: ReactNode;
  confirmText?: string | null;
  cancelText?: string | null;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
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
  content,
  onCancel,
  onClose,
  onConfirm,
  title,
  visiable
}) => {
  return (
    <DialogPortal>
      <div className={classes.root}>
        { title ? <div>{title}</div> : null }
        <div>{content}</div>
        <div className={classes.action}>
          { onCancel ? (
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
      </div>
    </DialogPortal>
  );
});

Dialog.displayName = 'Dialog';
