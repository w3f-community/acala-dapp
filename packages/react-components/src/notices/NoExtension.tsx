import React, { memo } from 'react';
import { Dialog, DialogContent, Button, DialogActions } from '@material-ui/core';

const POLKADOT_EXTENSIONS_ADDRESS = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';

interface Props {
  open: boolean;
}

export const NoExtension: React.FC<Props> = memo(({ open }) => {
  const handleGetExtensionBtnClick = (): void => {
    window.open(POLKADOT_EXTENSIONS_ADDRESS);
  };

  return (
    <Dialog open={open}>
      <DialogContent>{'No polkadot{.js} extension found, please install it first!'}</DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={handleGetExtensionBtnClick}
          variant='contained'
        >
          GET IT
        </Button>
      </DialogActions>
    </Dialog>
  );
});

NoExtension.displayName = 'NoExtension';
