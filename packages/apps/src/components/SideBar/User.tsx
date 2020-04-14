import React, { FC, memo } from 'react';
import { Menu } from 'semantic-ui-react';

import { ReactComponent as WalletIcon } from '@honzon-platform/apps/assets/wallet.svg';

import { ProductItem } from './ProductItem';
import { useAccounts } from '@honzon-platform/react-hooks';
import { FormatAddress } from '@honzon-platform/react-components';

export const User: FC = memo(() => {
  const { active } = useAccounts();

  if (!active) {
    return null;
  }

  return (
    <Menu>
      <ProductItem
        icon={<WalletIcon />}
        name={<FormatAddress address={active.address} />}
        path='wallet'
      />
    </Menu>
  );
});

User.displayName = 'User';
