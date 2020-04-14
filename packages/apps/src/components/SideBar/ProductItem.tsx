import React, { cloneElement, forwardRef, memo } from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '@honzon-platform/apps/types/sidebar';

export const ProductItem: React.FC<SideBarItem> = memo(({ icon, name, path }) => {
  const LinkBehavior = forwardRef((props: any, ref) => (
    <NavLink
      ref={ref}
      to={path as string}
      {...props}
    />
  ));

  LinkBehavior.displayName = 'LinkBehavior';

  return (
    <Menu.Item as={LinkBehavior}>
      {cloneElement(icon, { className: 'sidebar__icon' })}
      {name}
    </Menu.Item>
  );
});

ProductItem.displayName = 'ProductItem';
