import React, { FC, memo, ReactNode } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { BareProps } from './types';

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
    <Modal
      onClose={onClose}
      open={visiable}
      size='small'
    >
      { title ? <Modal.Header>{title}</Modal.Header> : null }
      <Modal.Content>
        {content}
      </Modal.Content>
      <Modal.Actions>
        { onCancel ? (
          <Button
            content={cancelText}
            onClick={onCancel}
          />
        ) : null }
        { onConfirm ? (
          <Button
            content={confirmText}
            onClick={onConfirm}
          />
        ) : null }
      </Modal.Actions>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';
