import React, { FC, memo } from 'react';
import { Dialog } from '@honzon-platform/ui-components';

export const NoAccount: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog 
      visiable={true}
      title={null}
      content='No account found, please add account in your wallet extension or unlock it!'
      cancelText={undefined}
      confirmText='Retry'
      onConfirm={handleRetry}
    />
  );
});

NoAccount.displayName = 'NoAccount';
