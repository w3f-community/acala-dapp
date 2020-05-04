import { ReactElement, ReactNode } from 'react';

export interface SideBarItem {
  icon: ReactElement;
  name: ReactNode;
  path?: string;
  target?: string;
  href?: string;
  isExternal?: boolean;
}

export interface SideBarConfig {
  products: SideBarItem[];
  socialMedia: SideBarItem[];
}
