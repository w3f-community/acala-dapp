import { SideBarConfig } from './types/sidebar';
import loanIcon from '@honzon-platform/apps/assets/loan.svg';
import twitterIcon from '@honzon-platform/apps/assets/twitter.svg';
import emailIcon from '@honzon-platform/apps/assets/email.svg';
import exchangeIcon from '@honzon-platform/apps/assets/exchange.svg';
import governanceIcon from '@honzon-platform/apps/assets/governance.svg';
import aUSDIcon from '@honzon-platform/apps/assets/coin/aUSD.svg';
import btcIcon from '@honzon-platform/apps/assets/coin/btc.svg';
import dotIcon from '@honzon-platform/apps/assets/coin/dot.svg';

export interface Asset {
    name: string;
    fullName: string;
    icon?: string;
}

export const assets: Map<number, Asset> = new Map([
    [0, { name: 'ACA', fullName: 'Acala' }],
    [1, { name: 'aUSD', icon: aUSDIcon, fullName: 'aUSD' }],
    [2, { name: 'DOT', icon: dotIcon, fullName: 'PolkaDOT' }],
    [3, { name: 'XBTC', icon: btcIcon, fullName: 'Bitcoin' }],
]);

export const airDropAssets: Map<number, Asset> = new Map([
    [0, { name: 'KAR', fullName: 'Kusama Aca' }],
    [1, { name: 'ACA', icon: aUSDIcon, fullName: 'Aca' }],
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
