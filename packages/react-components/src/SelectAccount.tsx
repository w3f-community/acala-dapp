import React, { useEffect, useState, memo } from 'react';
import { noop } from 'lodash';

import { AnyFunction } from '@polkadot/types/types';
import Identicon from '@polkadot/react-identicon';
import { useAccounts, useApi, useModal } from '@honzon-platform/react-hooks';
import { Dialog } from '@honzon-platform/ui-components';

import { ReactComponent as CheckedIcon } from './assets/checked.svg';
import classes from './SelectAccount.module.scss';

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
    <Dialog
      className={classes.root}
      title='Choose Account'
      visiable={status}
      onConfirm={confirmHandler}
    >
      <ul className={classes.list}>
        {
          accounts.map((item, index) => {
            return (
              <li
                key={`account-${item.address}`}
                className={classes.item}
                onClick={genSelectHandler(index)}
              >
                <Identicon
                  className={classes.icon}
                  value={item.address}
                  size={16}
                />
                <p className={classes.account}>{item.meta.name}</p>
                <div className={classes.checked}>
                {
                  selectedIndex === index ? <CheckedIcon /> : null
                }
                </div>
              </li>
            );
          })
        }
      </ul>
    </Dialog>
  );
});

SelectAccount.displayName = 'SelectAccount';
