import { SideBarConfig } from './types/sidebar';
import LoanIcon from '@/assets/loan.svg';
import TwitterIcon from '@/assets/twitter.svg';
import EmailIcon from '@/assets/email.svg';
import ExchangeIcon from '@/assets/exchange.svg';
import GovernaceIcon from '@/assets/governace.svg';
import StatesIcon from '@/assets/states.svg';

export const assets: Map<number, string> = new Map([
    [0, 'ACA'],
    [1, 'aUSD'],
    [2, 'DOT'],
    [3, 'XBTC'],
]);

export const collateral: number[] = [2, 3];

export const STABLE_COIN = 1;

export const getEndPoint = (): string => 'wss://testnet-node-1.acala.laminar.one/ws';

export const sideBarConfig: SideBarConfig = {
    products: [
        {
            name: 'Self Serviced Loan',
            path: 'loan',
            icon: LoanIcon,
        },
        {
            name: 'Exchange',
            path: 'exchange',
            icon: ExchangeIcon,
        },
        {
            name: 'Governance',
            path: 'governace',
            icon: GovernaceIcon,
        },
        {
            name: 'Acala Stats',
            path: 'states',
            icon: StatesIcon,
        },
    ],
    socialMedia: [
        {
            name: 'Email',
            icon: EmailIcon,
            href: 'mailto:hello@acala.network',
        },
        {
            name: 'Twitter',
            icon: TwitterIcon,
            href: 'https://twitter.com/AcalaNetwork',
            target: '_blank',
        },
    ],
};
