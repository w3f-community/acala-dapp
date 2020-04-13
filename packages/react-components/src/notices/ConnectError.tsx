import React, { FC, memo } from 'react';
import { Dialog } from '@honzon-platform/ui-components';

export const ConnectError: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog 
      visiable={true}
      title={null}
      content='Network Error, Please Retry Later!'
      cancelText={undefined}
      confirmText='Retry'
      onConfirm={handleRetry}
    />
  );
});

ConnectError.displayName = 'ConnectError';
