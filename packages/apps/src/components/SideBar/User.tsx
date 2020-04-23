import React, { FC, memo } from 'react';

import { ReactComponent as WalletIcon } from '@honzon-platform/apps/assets/wallet.svg';
import { useAccounts } from '@honzon-platform/react-hooks';
import { FormatAddress } from '@honzon-platform/react-components';

import { ProductItem } from './ProductItem';
import classes from './Sidebar.module.scss';

export const User: FC = memo(() => {
  const { active } = useAccounts();

  return (
    <div className={classes.area}>
      <ProductItem
        icon={<WalletIcon />}
        name={
          <div className={classes.wallet}>
            <p className={classes.title}>{active?.meta?.name || 'Wallet'}</p>
            <FormatAddress address={active?.address || ''} />
          </div>
        }
        path='wallet'
      />
    </div>
  );
});

User.displayName = 'User';
