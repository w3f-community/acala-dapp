import { Selector } from '@/types/store';
import { PriceData, BaseVaultData, IssuanceData } from '../types';
import FixedU128 from '@/utils/fixed_u128';

export const connectedSelector: Selector<boolean> = state => state.chain.connected;

export const pricesFeedSelector: Selector<PriceData[]> = state => state.chain.pricesFeed;

export const vaultsSelector: Selector<BaseVaultData[]> = state => state.chain.vaults;

export const specVaultSelector: (asset: number) => Selector<BaseVaultData | undefined> = asset => {
    return state => {
        return state.chain.vaults.find(item => item.asset === asset);
    };
};

export const specPriceSelector: (asset: number) => Selector<FixedU128> = asset => {
    return state => {
        const result = state.chain.pricesFeed.find(item => item.asset === asset);
        return result ? result.price : FixedU128.fromNatural(0);
    };
};

export const totalIssuanceSelector: Selector<IssuanceData[]> = state => state.chain.totalIssuance;

export const specIssuanceSelector: (asset: number) => Selector<FixedU128> = asset => {
    return state => {
        const result = state.chain.totalIssuance.find(item => item.asset === asset);
        return result ? result.issuance : FixedU128.fromNatural(0);
    };
};
