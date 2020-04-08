import React, { FC, memo } from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@material-ui/core';

export const NoAccount: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog open={true}>
      <DialogContent>
        No account found, please add account in your wallet extension or unlock it!
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={handleRetry}
        >
          Retry
        </Button>
      </DialogActions>
    </Dialog>
  );
});

NoAccount.displayName = 'NoAccount';
