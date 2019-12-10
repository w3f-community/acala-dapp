import { Selector } from '@/types/store';
import { PriceData, BaseVaultData } from '../types';

export const connectedSelector: Selector<{}, boolean> = state => state.chain.connected;

export const pricesFeedSelector: Selector<{}, PriceData[]> = state => state.chain.pricesFeed;

export const vaultsSelector: Selector<{}, BaseVaultData[]> = state => state.chain.vaults;

export const specVaultSelector: Selector<{ asset: number }, BaseVaultData | null> = (state, config) => {
    if (!config) {
        return null;
    }
    const result = state.chain.vaults.filter(item => item.asset === config.asset);
    return result.length ? result[0] : null;
};
