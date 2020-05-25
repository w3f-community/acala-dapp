import React, { FC, PropsWithChildren, useState } from 'react';
import { useAccounts, useApi, useNotification, useHistory } from '@acala-dapp/react-hooks';
import { Button, ButtonProps } from '@acala-dapp/ui-components';
import { FormatAddress } from './format';
import { SubmittableResult, ApiPromise } from '@polkadot/api';
import { CreateNotification } from '@acala-dapp/ui-components/Notification/context';
import { ITuple } from '@polkadot/types/types';
import { DispatchError } from '@polkadot/types/interfaces';

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

function extractEvents (api: ApiPromise, result: SubmittableResult, createNotification: CreateNotification): void {
  if (!result || !result.events) {
    return;
  }

  result
    .events
    .filter((event): boolean => !!event.event)
    .map(({ event: { data, method, section } }): void => {
      if (section === 'system' && method === 'ExtrinsicFailed') {
        const [dispatchError] = data as unknown as ITuple<[DispatchError]>;
        let message = dispatchError.type;

        if (dispatchError.isModule) {
          try {
            const mod = dispatchError.asModule;
            const error = api.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));

            message = `${error.section}.${error.name}`;
          } catch (error) {
            // swallow error
          }
        }

        createNotification({
          content: message,
          icon: 'error',
          removedDelay: 4000,
          title: `${section}.${method}`,
          type: 'error'
        });
      } else {
        createNotification({
          removedDelay: 4000,
          title: `${section}.${method}`,
          type: 'info'
        });
      }
    });
}

export const TxButton: FC<PropsWithChildren<Props>> = ({
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
  const { createNotification } = useNotification();
  const { refresh } = useHistory();

  const _onFailed = (): void => {
    onFailed && onFailed();
  };

  const _onSuccess = (): void => {
    onSuccess && onSuccess();
  };

  const _onFinally = (): void => {
    setIsSending(false);
    refresh(2000);
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

    // lock btn click
    setIsSending(true);

    try {
      const account = await api.query.system.account(active.address);

      const signedTx = await api.tx[section][method](...params).signAsync(
        active.address,
        {
          nonce: account.nonce.toNumber()
        }
      );

      const hash = signedTx.hash.toString();

      const notification = createNotification({
        content: <FormatAddress address={hash} />,
        icon: 'loading',
        title: `${section}: ${method}`,
        type: 'info'
      });

      // timeout
      await Promise.race([
        new Promise((resolve) => setTimeout(() => resolve('timeout'), TX_TIMEOUT)),
        new Promise((resolve, reject) => {
          (async (): Promise<void> => {
            const unsub = await signedTx.send((result) => {
              if (
                result.status.isInBlock ||
                result.status.isFinalized
              ) {
                unsub && unsub();
                resolve(result);
                extractEvents(api, result as unknown as SubmittableResult, createNotification);
              } else if (
                result.status.isUsurped ||
                result.status.isDropped ||
                result.status.isFinalityTimeout
              ) {
                unsub && unsub();
                reject(result);
              }
            }).catch(reject);
          })();
        })
      ]).then((result) => {
        if (result === 'timeout') {
          notification.update({
            icon: 'info',
            removedDelay: 4000,
            title: 'Extrinsic timed out, Please check manually',
            type: 'info'
          });
        } else {
          notification.update({
            icon: 'success',
            removedDelay: 4000,
            type: 'success'
          });
          _onSuccess();
        }
      }).catch(() => {
        notification.update({
          icon: 'error',
          removedDelay: 4000,
          type: 'error'
        });
        _onFailed();
      }).finally(() => {
        _onFinally();
      });
    } catch (e) {
      // reset isSending
      setIsSending(false);
    }
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
