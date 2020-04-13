import React, { memo } from 'react';
import { Dialog } from '@honzon-platform/ui-components';

const POLKADOT_EXTENSIONS_ADDRESS = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';

interface Props {
  open: boolean;
}

export const NoExtension: React.FC<Props> = memo(({ open }) => {
  const handleGetExtensionBtnClick = (): void => {
    window.open(POLKADOT_EXTENSIONS_ADDRESS);
  };

  return (
    <Dialog
      visiable={true}
      title={null}
      content='No polkadot{.js} extension found, please install it first!'
      cancelText={undefined}
      confirmText='GET IT'
      onConfirm={handleGetExtensionBtnClick}
    />
  );
});

NoExtension.displayName = 'NoExtension';
