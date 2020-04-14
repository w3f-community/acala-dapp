import React from 'react';
import { SideBarConfig } from '@honzon-platform/apps/types/sidebar';
// import { AcalaLogo } from '@honzon-platform/apps/components/acala-logo';
import { Products } from './Products';
import { SocialMedias } from './SocalMedias';
import { User } from './User';
import styled from 'styled-components';

export interface SideBarProps {
  config: SideBarConfig;
}

const Root = styled('aside')`
  flex: 0 0 260px;
  height: 100vh;
  background: #01279C;
  overflow: hidden;

  & .ui.menu {
    width: 100%;
    flex-direction: column;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  & .ui.menu .item {
    color: #ffffff;
  }

  & .sidebar__icon {
    margin-right: 20px;
  }
`;

export const Sidebar: React.FC<SideBarProps> = ({ config }) => {
  return (
    <Root>
      <User />
      <Products data={config.products} />
      <SocialMedias data={config.socialMedia} />
    </Root>
  );
};
