import { SideBarConfig } from './types/sidebar';
import loanIcon from '@/assets/loan.svg';
import twitterIcon from '@/assets/twitter.svg';
import emailIcon from '@/assets/email.svg';
import exchangeIcon from '@/assets/exchange.svg';
import governanceIcon from '@/assets/governance.svg';
import statesIcon from '@/assets/states.svg';
import aUSDIcon from '@/assets/coin/aUSD.svg';
import btcIcon from '@/assets/coin/btc.svg';
import dotIcon from '@/assets/coin/dot.svg';
import ethIcon from '@/assets/coin/eth.svg';

import FixedU128 from './utils/fixed_u128';

export interface Asset {
    name: string;
    fullName: string;
    icon?: string;
}

export const assets: Map<number, Asset> = new Map([
    [0, { name: 'ACA', fullName: 'Acalc' }],
    [1, { name: 'aUSD', icon: aUSDIcon, fullName: 'aUSD' }],
    [2, { name: 'DOT', icon: dotIcon, fullName: 'PolkaDOT' }],
    [3, { name: 'XBTC', icon: btcIcon, fullName: 'Bitcoin' }],
]);

export const COLLATERAL: number[] = [2, 3];

export const DEX_TOKENS: number[] = [1, 2, 3];

export const STABLE_COIN = 1;

export const POLKADOT_EXTENSIONS_ADDRESS =
    'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';

export const sideBarConfig: SideBarConfig = {
    products: [
        {
            name: 'Self Serviced Loan',
            path: 'loan',
            icon: loanIcon,
        },
        {
            name: 'Exchange',
            path: 'exchange',
            icon: exchangeIcon,
        },
        {
            name: 'Governance',
            path: 'governance',
            icon: governanceIcon,
        },
        // {
        //     name: 'Acala Stats',
        //     path: 'states',
        //     icon: statesIcon,
        // },
    ],
    socialMedia: [
        {
            name: 'Email',
            icon: emailIcon,
            href: 'mailto:hello@acala.network',
        },
        {
            name: 'Twitter',
            icon: twitterIcon,
            href: 'https://twitter.com/AcalaNetwork',
            target: '_blank',
        },
    ],
};
