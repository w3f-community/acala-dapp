import React, { useEffect, useState, memo } from 'react';
import { noop } from 'lodash';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, List, ListItem, ListItemText } from '@material-ui/core';
import { AnyFunction } from '@polkadot/types/types';

import { useAccounts, useApi, useModal } from '@honzon-platform/react-hooks';

interface Props {
  onSelect?: () => void;
}

export const SelectAccount: React.FC<Props> = memo(({ onSelect }) => {
  const { accounts, setActiveAccount } = useAccounts();
  const { api } = useApi();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { close, open, status } = useModal(false);

  // auto select the first account, if only one in the list
  useEffect(() => {
    if (!accounts || accounts.length === 0) return noop;

    if (accounts.length === 1) {
      setActiveAccount(accounts[0], api);

      return noop;
    }

    open();
  }, [accounts, api, open, setActiveAccount]);

  const confirmHandler = (): void => {
    setActiveAccount(accounts[selectedIndex], api);
    onSelect && onSelect();
    close();
  };

  const genSelectHandler = (index: number): AnyFunction => (): void => setSelectedIndex(index);

  return (
    <Dialog open={status}>
      <DialogTitle>Select Account</DialogTitle>
      <DialogContent>
        <List disablePadding>
          {accounts.map((account, index) => (
            <ListItem
              button
              key={`account-${account.address}`}
              onClick={genSelectHandler(index)}
              selected={index === selectedIndex}
            >
              <ListItemText primary={account.address} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          color='primary'
          onClick={confirmHandler}
          variant='contained'
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
});

SelectAccount.displayName = 'SelectAccount';
