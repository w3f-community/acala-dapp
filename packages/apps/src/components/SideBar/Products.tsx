import React, { FC, memo } from 'react';

import { SideBarConfig } from '@honzon-platform/apps/types/sidebar';

import { ProductItem } from './ProductItem';

interface Props {
  data: SideBarConfig['products'];
}

export const Products: FC<Props> = memo(({ data }) => {
  return (
    <div>
      {data.map((item) => (
        <ProductItem
          key={`products-${item.name}`}
          {...item}
        />
      ))}
    </div>
  );
});

Products.displayName = 'Products';
