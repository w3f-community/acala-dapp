import React, { FC, memo } from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@material-ui/core';

export const ConnectError: FC = memo(() => {
  const handleRetry = (): void => window.location.reload();

  return (
    <Dialog open={true}>
      <DialogContent>
        Network Error, Please Retry Later!
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

ConnectError.displayName = 'ConnectError';
