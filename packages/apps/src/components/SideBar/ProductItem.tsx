import React, { cloneElement, memo } from 'react';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '@honzon-platform/apps/types/sidebar';

import classes from './Sidebar.module.scss';

export const ProductItem: React.FC<SideBarItem> = memo(({ icon, isExternal, name, path, target }) => {
  const search = window.location.search;

  if (isExternal) {
    return (
      <a
        className={classes.item}
        href={path}
        target={target}
      >
        {cloneElement(icon)}
        {name}
      </a>
    );
  }

  return (
    <NavLink className={classes.item}
      to={`${path as string}${search}`}>
      {cloneElement(icon)}
      {name}
    </NavLink>
  );
});

ProductItem.displayName = 'ProductItem';
