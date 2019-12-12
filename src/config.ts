import { SideBarConfig } from './types/sidebar';
import LoanIcon from '@/assets/loan.svg';
import TwitterIcon from '@/assets/twitter.svg';
import EmailIcon from '@/assets/email.svg';

export const assets: Map<number, string> = new Map([
    [1, 'aUSD'],
    [2, 'XBTC'],
    [3, 'DOT'],
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
    ],
    socialMedia: [
        {
            name: 'Email',
            icon: EmailIcon,
            path: '',
        },
        {
            name: 'Twitter',
            icon: TwitterIcon,
            path: '',
        },
    ],
};
