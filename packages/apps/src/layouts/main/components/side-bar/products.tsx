import React, { FC } from 'react';
import { withStyles } from '@material-ui/styles';
import { Theme, List } from '@material-ui/core';
import { SideBarConfig } from '@honzon-platform/apps/types/sidebar';
import { ProductItem } from './product-item';

const ProductList = withStyles((theme: Theme) => ({
    root: {
        margin: '0 0 112px 0',
    },
}))(List);

interface Props {
    data: SideBarConfig['products'];
}

export const Products: FC<Props> = ({ data }) => {
    return (
        <ProductList>
            {data.map(item => (
                <ProductItem {...item} key={`products-${item.name}`} />
            ))}
        </ProductList>
    );
};
