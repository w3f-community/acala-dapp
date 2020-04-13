import React, { FC, forwardRef, cloneElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import { SideBarConfig, SideBarItem } from '@honzon-platform/apps/types/sidebar';


const SocialMediaItem: FC<SideBarItem> = ({ href, icon, name }) => {
  const LinkBehavior = forwardRef((props: any, ref) => (
    <NavLink
      ref={ref}
      to={href as string}
      {...props}
    />
  ));

  LinkBehavior.displayName = 'LinkBehavior';

  return (
    <Menu.Item as='a'>
      {cloneElement(icon, { className: 'sidebar__icon' })}
      {name}
    </Menu.Item>
  );
};

interface Props {
  data: SideBarConfig['socialMedia'];
}

export const SocialMedias: FC<Props> = ({ data }) => {
  return (
    <Menu>
      {data.map((item) => (
        <SocialMediaItem
          key={`products-${item.name}`}
          {...item}
        />
      ))}
    </Menu>
  );
};
