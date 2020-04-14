import React, { FC, memo } from 'react';

import { SideBarConfig } from '@honzon-platform/apps/types/sidebar';

import { ProductItem } from './ProductItem';
import { Menu } from 'semantic-ui-react';

interface Props {
  data: SideBarConfig['products'];
}

export const Products: FC<Props> = memo(({ data }) => {
  return (
    <Menu>
      {data.map((item) => (
        <ProductItem
          key={`products-${item.name}`}
          {...item}
        />
      ))}
    </Menu>
  );
});

Products.displayName = 'Products';
