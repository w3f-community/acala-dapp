import { ReactElement } from 'react';

export interface SideBarItem {
  icon: ReactElement;
  name: string;
  path?: string;
  target?: string;
  href?: string;
}

export interface SideBarConfig {
  products: SideBarItem[];
  socialMedia: SideBarItem[];
}
