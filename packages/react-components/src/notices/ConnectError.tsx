import React, { FC, memo } from 'react';
import { Dialog } from '@acala-dapp/ui-components';

export const ConnectError: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog
      cancelText={undefined}
      confirmText='Retry'
      onConfirm={handleRetry}
      title={null}
      visiable={true}
    >
      <p>Network Error, Please Retry Later!</p>
    </Dialog>
  );
});

ConnectError.displayName = 'ConnectError';
