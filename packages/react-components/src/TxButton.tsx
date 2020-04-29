import React, { FC, PropsWithChildren, useState, useContext } from 'react';
import { useAccounts, useApi, useNotification } from '@honzon-platform/react-hooks';
import { NotificationContext, Button } from '@honzon-platform/ui-components';
import { BareProps } from '@honzon-platform/ui-components/types';
import { FormatAddress } from './format';

interface Props extends BareProps {
  size?: 'small' | 'large';
  disabled: boolean;
  section: string;
  method: string;
  params: any[];
  onSuccess?: () => void;
  onFailed?: () => void;
  onFinally?: () => void;
}

export const TxButton: FC<PropsWithChildren<Props>> = ({
  disabled,
  className,
  children,
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

    extrinsic.signAndSend(active.address, (result) => {
      if (result.isInBlock) {
        notification.update({
          icon: 'success',
          type: 'success',
          removedDelay: 4000
        });
        _onSuccess();
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
      disabled={disabled || isSending}
      loading={isSending}
      onClick={onClick}
      size={size}
      color='primary'
    >
      {children}
    </Button>
  );
};
