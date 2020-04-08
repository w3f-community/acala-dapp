import React, { FC } from 'react';
import { withStyles } from '@material-ui/styles';
import { List } from '@material-ui/core';

import { ReactComponent as WalletIcon } from '@honzon-platform/apps/assets/wallet.svg';

import { ProductItem } from './ProductItem';
import { useAccounts } from '@honzon-platform/react-hooks';

const ProductList = withStyles(() => ({
  root: {
    margin: '0 0 37px 0'
  }
}))(List);

export const UserCenter: FC = () => {
  const { active } = useAccounts();

  return (
    <ProductList>
      <ProductItem
        icon={<WalletIcon />}
        name={active ? active.address : ''}
        path='wallet'
      />
    </ProductList>
  );
};
