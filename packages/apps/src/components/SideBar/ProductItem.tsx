import React, { cloneElement, memo } from 'react';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '@honzon-platform/apps/types/sidebar';

import classes from './Sidebar.module.scss';

export const ProductItem: React.FC<SideBarItem> = memo(({ icon, name, path, isExternal, target }) => {
  const search = window.location.search;

  if (isExternal) {
    return (
      <a
        href={path}
        className={classes.item}
        target={target}
      >
        {cloneElement(icon)}
        {name}
      </a>
    );
  }
  return (
    <NavLink to={`${path as string}${search}`} className={classes.item}>
      {cloneElement(icon)}
      {name}
    </NavLink>
  );
});

ProductItem.displayName = 'ProductItem';
