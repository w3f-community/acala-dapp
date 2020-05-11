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

const TX_TIMEOUT = 60 * 1000;

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

  const onClick = async (): Promise<void> => {
    if (!api.tx[section] || !api.tx[section][method]) {
      console.error(`can not find api.tx.${section}.${method}`);

      return;
    }

    if (!(active && active.address)) {
      console.error('can not find available address');

      return;
    }
    const account = await api.query.system.account(active.address);
    const signedTx = await api.tx[section][method](...params).signAsync(
      active.address,
      {
        nonce: account.nonce.toNumber()
      }
    );

    const hash = signedTx.hash.toString();

    const notification = createNotification({
      icon: 'loading',
      content: <FormatAddress address={hash} />,
      placement: 'top right',
      type: 'info',
      title: `${section}: ${method}`
    });

    // lock btn click
    setIsSending(true);

    // timeout
    await Promise.race([
      new Promise((resolve) => setTimeout(() => resolve('timeout'), TX_TIMEOUT)),
      new Promise((resolve, reject) => {
        signedTx.send((result) => {
          console.log(result.toHuman());
          if (
            result.status.isInBlock
            || result.status.isFinalized
          ) {
            resolve(result);
          } else if(
            result.status.isInvalid
            || result.status.isUsurped
            || result.status.isDropped
            || result.status.isFinalityTimeout
          ){
            reject(result);
          }
        }).catch(reject);
      })
    ]).then((result) => {
      if (result === 'timeout') {
        notification.update({
          icon: 'info',
          type: 'info',
          title: 'Extrinsic timed out, Please check manually',
          removedDelay: 4000
        });
      } else {
        notification.update({
          icon: 'success',
          type: 'success',
          removedDelay: 4000
        });
        _onSuccess();
        push(hash, signedTx, addon);
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
