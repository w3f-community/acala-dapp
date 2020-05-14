import React, { FC, PropsWithChildren, useState, useContext } from 'react';
import { useAccounts, useApi, useNotification, useHistory } from '@honzon-platform/react-hooks';
import { Button, ButtonProps } from '@honzon-platform/ui-components';
import { FormatAddress } from './format';
import { SubmittableResult, ApiPromise } from '@polkadot/api';
import { CreateNotification } from '@honzon-platform/ui-components/Notification/context';
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

function extractEvents (api: ApiPromise, result: SubmittableResult, createNotification: CreateNotification) {
  if (!result ||!result.events) {
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
            } catch (error) { }
          }

          createNotification({
            type: 'error',
            icon: 'error',
            title: `${section}.${method}`,
            content: message,
            removedDelay: 4000
          });
      } else {
          createNotification({
            type: 'info',
            title: `${section}.${method}`,
            removedDelay: 4000
          });
      }
    });
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
        icon: 'loading',
        content: <FormatAddress address={hash} />,
        type: 'info',
        title: `${section}: ${method}`
      });

      // timeout
      await Promise.race([
        new Promise((resolve) => setTimeout(() => resolve('timeout'), TX_TIMEOUT)),
        new Promise(async (resolve, reject) => {
          const unsub = await signedTx.send((result) => {
            if (
              result.status.isInBlock
              || result.status.isFinalized
            ) {
              resolve(result);
            } else if(
              result.status.isUsurped
              || result.status.isDropped
              || result.status.isFinalityTimeout
            ){
              unsub && unsub();
              reject(result);
            }

            if (result.status.isFinalized) {
              unsub && unsub();
            } else {
              extractEvents(api, result as unknown as SubmittableResult, createNotification);
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
        }
      }).catch((error) => {
        notification.update({
          icon: 'error',
          type: 'error',
          removedDelay: 4000
        });
        _onFailed();
      }).finally(() => {
        _onFinally();
      });
    } catch(e) {
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
