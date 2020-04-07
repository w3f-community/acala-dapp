import React, { FC } from 'react';
import { withStyles } from '@material-ui/styles';
import { List } from '@material-ui/core';

import { SideBarConfig } from '@honzon-platform/apps/types/sidebar';

import { ProductItem } from './ProductItem';

const ProductList = withStyles(() => ({
  root: {
    flex: '1 1 auto',
    margin: '0 0 112px 0'
  }
}))(List);

interface Props {
  data: SideBarConfig['products'];
}

export const Products: FC<Props> = ({ data }) => {
  return (
    <ProductList>
      {data.map((item) => (
        <ProductItem
          key={`products-${item.name}`}
          {...item}
        />
      ))}
    </ProductList>
  );
};
