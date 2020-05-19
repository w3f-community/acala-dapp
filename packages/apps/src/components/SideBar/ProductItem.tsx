import React, { cloneElement, memo } from 'react';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '@acala-dapp/apps/types/sidebar';

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
        <span className={classes.title}>
          {name}
        </span>
      </a>
    );
  }

  return (
    <NavLink className={classes.item}
      to={`${path as string}${search}`}>
      {cloneElement(icon)}
      <span className={classes.title}>
        {name}
      </span>
    </NavLink>
  );
});

ProductItem.displayName = 'ProductItem';
