import React, { FC, PropsWithChildren, useState, useContext, useEffect } from 'react';
import { useAccounts, useApi } from "@honzon-platform/react-hooks";
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

export const TxButton: FC<PropsWithChildren<Props>> = ({ children, section, method, params, onSuccess, onFailed, onFinally }) => {
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
  }

  const onClick = () => {
    if (!api.tx[section] || !api.tx[section][method]) {
      console.error(`can not find api.tx.${section}.${method}`);
      return false;
    }
    const extrinsic = api.tx[section][method](...params);
    const notification = createNotification({
      title: extrinsic.hash.hash,
      content: 'loading',
      placement: 'top right'
    });
    extrinsic.signAndSend(active!.address, (result) => {
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
    })
  }

  useEffect(() => {

  }, [section, method, params]);

  return (
    <Button
      primary
      loading={isSending}
      disabled={isSending}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
