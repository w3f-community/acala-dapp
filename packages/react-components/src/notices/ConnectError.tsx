import React, { FC, memo } from 'react';
import { Dialog } from '@honzon-platform/ui-components';

export const ConnectError: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog
      cancelText={undefined}
      confirmText='Retry'
      content='Network Error, Please Retry Later!'
      onConfirm={handleRetry}
      title={null}
      visiable={true}
    />
  );
});

ConnectError.displayName = 'ConnectError';
