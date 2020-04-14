import React, { memo } from 'react';
import { Dialog } from '@honzon-platform/ui-components';

const POLKADOT_EXTENSIONS_ADDRESS = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';

export const NoExtension: React.FC = memo(() => {
  const handleGetExtensionBtnClick = (): void => {
    window.open(POLKADOT_EXTENSIONS_ADDRESS);
  };

  return (
    <Dialog
      cancelText={undefined}
      confirmText='GET IT'
      content='No polkadot{.js} extension found, please install it first!'
      onConfirm={handleGetExtensionBtnClick}
      title={null}
      visiable={true}
    />
  );
});

NoExtension.displayName = 'NoExtension';
