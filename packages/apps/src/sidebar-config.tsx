import React from 'react';

import { ReactComponent as TwitterSVG } from '@honzon-platform/apps/assets/twitter.svg';
import { ReactComponent as EmailSVG } from '@honzon-platform/apps/assets/email.svg';
import { ReactComponent as LoanSVG } from '@honzon-platform/apps/assets/loan.svg';
import { ReactComponent as ExchangeSVG } from '@honzon-platform/apps/assets/exchange.svg';
import { ReactComponent as GovernanceSVG } from '@honzon-platform/apps/assets/governance.svg';

import { SideBarConfig } from './types/sidebar';

export const sideBarConfig: SideBarConfig = {
  products: [
    {
      icon: <LoanSVG />,
      name: 'Homa',
      path: 'homa'
    },
    {
      icon: <LoanSVG />,
      name: 'Self Serviced Loan',
      path: 'loan'
    },
    {
      icon: <ExchangeSVG />,
      name: 'Swap',
      path: 'swap'
    },
    {
      icon: <GovernanceSVG />,
      name: 'Governance',
      path: 'governance'
    }
  ],
  socialMedia: [
    {
      href: 'mailto:hello@acala.network',
      icon: <EmailSVG />,
      name: 'Email'
    },
    {
      href: 'https://twitter.com/AcalaNetwork',
      icon: <TwitterSVG />,
      name: 'Twitter',
      target: '_blank'
    }
  ]
};
