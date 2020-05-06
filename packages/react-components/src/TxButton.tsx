import React, { FC, PropsWithChildren, useState, useContext } from 'react';
import { useAccounts, useApi, useNotification, useHistory } from '@honzon-platform/react-hooks';
import { Button, ButtonProps } from '@honzon-platform/ui-components';
import { FormatAddress } from './format';

interface Props extends ButtonProps {
  section: string;
  method: string;
  params: any[];
  onSuccess?: () => void;
  onFailed?: () => void;
  onFinally?: () => void;
  addon?: any;
}

export const TxButton: FC<PropsWithChildren<Props>> = ({
  addon,
  children,
  className,
  disabled,
  method,
  onFailed,
  onFinally,
  onSuccess,
  params,
  section,
  size
}) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const [isSending, setIsSending] = useState<boolean>(false);
  const { push } = useHistory();
  const { createNotification } = useNotification();

  const _onFailed = (): void => {
    setIsSending(false);
    onFailed && onFailed();
  };

  const _onSuccess = (): void => {
    setIsSending(false);
    onSuccess && onSuccess();
  };

  const _onFinally = (): void => {
    onFinally && onFinally();
  };

  const onClick = (): void => {
    if (!api.tx[section] || !api.tx[section][method]) {
      console.error(`can not find api.tx.${section}.${method}`);

      return;
    }

    if (!(active && active.address)) {
      console.error('can not find available address');

      return;
    }

    const extrinsic = api.tx[section][method](...params);
    const notification = createNotification({
      icon: 'loading',
      content: <FormatAddress address={extrinsic.hash.hash.toString()} />,
      placement: 'top right',
      type: 'info',
      title: `${section}: ${method}`
    });

    // lock btn click
    setIsSending(true);

    extrinsic.signAndSend(active.address, (result) => {
      if (result.isInBlock) {
        notification.update({
          icon: 'success',
          type: 'success',
          removedDelay: 4000
        });
        _onSuccess();
        push(extrinsic, addon);
      }
    }).catch(() => {
      notification.update({
        icon: 'error',
        type: 'error',
        removedDelay: 4000
      });
      _onFailed();
    }).finally(() => {
      _onFinally();
    });
  };

  return (
    <Button
      className={className}
      color='primary'
      disabled={disabled || isSending}
      loading={isSending}
      onClick={onClick}
      size={size}
    >
      {children}
    </Button>
  );
};
