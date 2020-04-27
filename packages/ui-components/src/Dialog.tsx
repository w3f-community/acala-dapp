import React, { FC, memo, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { BareProps } from './types';
import classes from './Dialog.module.scss';
import { Button } from './Button';
import clsx from 'clsx';
import { randomID } from './utils';

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
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const $body = document.querySelector('body')!;
  const $divRef = useRef(document.createElement('div'));
  const _uid = useRef(randomID());
  const $div = $divRef.current;

  useEffect((): () => void => {
    $body.append($div);
    $div.classList.add(`modal-${_uid.current}`);
    return (): void => { $body.removeChild($div); };
  }, [$body, $div]);

  if (!visiable) {
    return null;
  }

  return createPortal((
    <div
      className={
        clsx({ [classes.mask]: visiable })
      }
    >
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
            action ? action : (
              <>
                {showCancel ? (
                  <Button
                    size='small'
                    onClick={onCancel}
                    normal
                  >
                    {cancelText}
                  </Button>
                ) : null}
                {onConfirm ? (
                  <Button
                    size='small'
                    onClick={onConfirm}
                    primary
                  >
                    {confirmText}
                  </Button>
                ) : null}
              </>
            )
          }
        </div>
      </div>
    </div>
  ), $div);
});

Dialog.displayName = 'Dialog';
