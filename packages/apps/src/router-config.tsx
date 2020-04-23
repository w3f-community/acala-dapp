import React, { ReactElement } from 'react';

import PageDeposit from '@honzon-platform/page-deposit';
import PageLoan from '@honzon-platform/page-loan';
import PageHoma from '@honzon-platform/page-homa';
import PageSwap from '@honzon-platform/page-swap';
import PageWallet from '@honzon-platform/page-wallet';

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
        element: <PageWallet />,
        path: 'wallet'
      },
      {
        element: <PageDeposit />,
        path: 'deposit'
      },
      {
        element: <PageLoan />,
        path: 'loan'
      },
      {
        element: <PageHoma />,
        path: 'homa'
      },
      {
        element: <PageSwap />,
        path: 'swap'
      }
    ],
    element: <MainLayout sideBarProps={{ config: sideBarConfig }} />,
    path: '/'
  }
];
