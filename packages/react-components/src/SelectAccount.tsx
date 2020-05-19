import React, { useState, memo } from 'react';

import { AnyFunction } from '@polkadot/types/types';
import Identicon from '@polkadot/react-identicon';
import { Dialog } from '@acala-dapp/ui-components';

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
      onConfirm={confirmHandler}
      title='Choose Account'
      visiable={visable}
    >
      <ul className={classes.list}>
        {
          accounts.map((item, index) => {
            return (
              <li
                className={classes.item}
                key={`account-${item.address}`}
                onClick={genSelectHandler(index)}
              >
                <Identicon
                  className={classes.icon}
                  size={16}
                  value={item.address}
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
