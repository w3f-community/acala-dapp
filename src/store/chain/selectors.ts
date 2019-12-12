import { Selector } from '@/types/store';
import { PriceData, BaseVaultData, IssuanceData } from '../types';

export const connectedSelector: Selector<boolean> = state => state.chain.connected;

export const pricesFeedSelector: Selector<PriceData[]> = state => state.chain.pricesFeed;

export const vaultsSelector: Selector<BaseVaultData[]> = state => state.chain.vaults;

export const specVaultSelector: (asset: number) => Selector<BaseVaultData | null> = asset => {
    return state => {
        const result = state.chain.vaults.filter(item => item.asset === asset);
        return result.length ? result[0] : null;
    };
};

export const specPriceSelector: (asset: number) => Selector<number> = asset => {
    return state => {
        const result = state.chain.pricesFeed.filter(item => item.asset === asset);
        return result.length ? result[0].price : 0;
    };
};

export const totalIssuanceSelector: Selector<IssuanceData[]> = state => state.chain.totalIssuance;

export const specIssuanceSelector: (asset: number) => Selector<number> = asset => {
    return state => {
        const result = state.chain.totalIssuance.filter(item => item.asset === asset);
        return result.length ? result[0].issuance : 0;
    };
};
