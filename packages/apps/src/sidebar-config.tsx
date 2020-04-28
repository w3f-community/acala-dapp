import React from 'react';

import { ReactComponent as DepositSVG } from '@honzon-platform/apps/assets/deposit.svg';
import { ReactComponent as TwitterSVG } from '@honzon-platform/apps/assets/twitter.svg';
import { ReactComponent as EmailSVG } from '@honzon-platform/apps/assets/email.svg';
import { ReactComponent as LoanSVG } from '@honzon-platform/apps/assets/loan.svg';
import { ReactComponent as ExchangeSVG } from '@honzon-platform/apps/assets/exchange.svg';
import { ReactComponent as GovernanceSVG } from '@honzon-platform/apps/assets/governance.svg';
import { ReactComponent as LiquidSVG } from '@honzon-platform/apps/assets/liquid.svg';

import { SideBarConfig } from './types/sidebar';

export const sideBarConfig: SideBarConfig = {
  products: [
    {
      icon: <LoanSVG />,
      name: 'Self Serviced Loan',
      path: 'loan'
    },
    {
      icon: <ExchangeSVG />,
      name: 'Exchange',
      path: 'swap'
    },
    {
      icon: <DepositSVG />,
      name: 'Deposit & Earn',
      path: 'deposit'
    },
    {
      icon: <LiquidSVG />,
      name: 'Liquid DOT',
      path: 'homa'
    },
    // {
    //   icon: <GovernanceSVG />,
    //   name: 'Governance',
    //   path: 'governance'
    // }
  ],
  socialMedia: [
    {
      icon: <EmailSVG />,
      name: 'Email',
      path: 'mailto:hello@acala.network'
    },
    {
      icon: <TwitterSVG />,
      name: 'Twitter',
      path: 'https://twitter.com/AcalaNetwork'
    }
  ]
};
