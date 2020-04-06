import React, { ReactNode } from 'react';

import PageLoan from '@honzon-platform/page-loan';

import { MainLayout } from './layouts/Main';

export interface RouterConfigData {
  children?: RouterConfigData[];
  element: ReactNode;
  layout?: ReactNode;
  path: string;
}

export const config: RouterConfigData[] = [
  {
    element: <PageLoan />,
    layout: MainLayout,
    path: '/'
  }
];
