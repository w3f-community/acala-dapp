import React, { cloneElement, memo } from 'react';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '@honzon-platform/apps/types/sidebar';

import classes from './Sidebar.module.scss';

export const ProductItem: React.FC<SideBarItem> = memo(({ icon, name, path }) => {
  return (
    <NavLink to={path as string} className={classes.item}>
      {cloneElement(icon, { className: 'sidebar__icon' })}
      {name}
    </NavLink>
  );
});

ProductItem.displayName = 'ProductItem';
