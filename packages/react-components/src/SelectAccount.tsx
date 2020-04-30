import React, { useEffect, useState, memo } from 'react';
import { noop } from 'lodash';

import { AnyFunction } from '@polkadot/types/types';
import Identicon from '@polkadot/react-identicon';
import { useAccounts, useApi, useModal } from '@honzon-platform/react-hooks';
import { Dialog } from '@honzon-platform/ui-components';

import { ReactComponent as CheckedIcon } from './assets/checked.svg';
import classes from './SelectAccount.module.scss';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface Props {
  accounts: InjectedAccountWithMeta[];
  visable: boolean;
  onSelect?: (account: InjectedAccountWithMeta) => void;
}

export const SelectAccount: React.FC<Props> = memo(({
  accounts,
  onSelect,
  visable
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const confirmHandler = (): void => {
    onSelect && onSelect(accounts[selectedIndex]);
  };

  const genSelectHandler = (index: number): AnyFunction => (): void => setSelectedIndex(index);

  return (
    <Dialog
      className={classes.root}
      title='Choose Account'
      visiable={visable}
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
