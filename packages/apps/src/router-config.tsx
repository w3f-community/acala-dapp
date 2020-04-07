import React, { ReactElement } from 'react';

import PageLoan from '@honzon-platform/page-loan';
import PageHoma from '@honzon-platform/page-homa';

import { MainLayout } from './layouts/Main';
import { sideBarConfig } from './sidebar-config';

export interface RouterConfigData {
  children?: RouterConfigData[];
  element: ReactElement;
  path: string;
}

export const config: RouterConfigData[] = [
  {
    children: [
      {
        element: <PageLoan />,
        path: 'loan'
      },
      {
        element: <PageHoma />,
        path: 'homa'
      }
    ],
    element: <MainLayout sideBarProps={{ config: sideBarConfig }} />,
    path: '/'
  }
];
