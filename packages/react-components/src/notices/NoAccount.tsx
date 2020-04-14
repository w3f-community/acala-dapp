import React, { FC, memo } from 'react';
import { Dialog } from '@honzon-platform/ui-components';

export const NoAccount: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog
      cancelText={undefined}
      confirmText='Retry'
      content='No account found, please add account in your wallet extension or unlock it!'
      onConfirm={handleRetry}
      title={null}
      visiable={true}
    />
  );
});

NoAccount.displayName = 'NoAccount';
