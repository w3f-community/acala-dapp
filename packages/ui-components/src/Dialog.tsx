import React, { FC, memo, ReactNode } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { BareProps } from './types';
import styled from 'styled-components';

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
  visiable,
  title,
  content,
  cancelText = 'Cancel',
  confirmText = 'Confrim',
  onConfirm,
  onCancel,
  onClose
}) => {
  return (
    <Modal size='small' open={visiable} onClose={onClose}>
      { title ? <Modal.Header>{title}</Modal.Header> : null }
      <Modal.Content>{content}</Modal.Content>
      <Modal.Actions>
        { onCancel ? <Button onClick={onCancel} content={cancelText} /> : null }
        { onConfirm ? <Button onClick={onConfirm} content={confirmText} /> : null }
      </Modal.Actions>
    </Modal>
  );
});