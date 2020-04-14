import React, { FC, PropsWithChildren, useState, useContext } from 'react';
import { useAccounts, useApi } from '@honzon-platform/react-hooks';
import { NotificationContext } from '@honzon-platform/ui-components';
import { Button } from 'semantic-ui-react';

interface Props {
  section: string;
  method: string;
  params: any[];
  onSuccess?: () => void;
  onFailed?: () => void;
  onFinally?: () => void;
}

export const TxButton: FC<PropsWithChildren<Props>> = ({
  children,
  method,
  onFailed,
  onFinally,
  onSuccess,
  params,
  section
}) => {
  const { api } = useApi();
  const { active } = useAccounts();
  const [isSending, setIsSending] = useState<boolean>(false);
  const { createNotification } = useContext(NotificationContext);

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
      content: 'loading',
      placement: 'top right',
      title: extrinsic.hash.hash
    });

    extrinsic.signAndSend(active.address, (result) => {
      if (result.isInBlock) {
        notification.update({
          content: 'success',
          removedDelay: 4000
        });
        _onSuccess();
      }
    }).catch(() => {
      _onFailed();
    }).finally(() => {
      _onFinally();
    });
  };

  return (
    <Button
      disabled={isSending}
      loading={isSending}
      onClick={onClick}
      primary
    >
      {children}
    </Button>
  );
};
