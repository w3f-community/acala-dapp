import { Selector, PriceData, BaseVaultData, IssuanceData } from '@/types/store';
import FixedU128 from '@/utils/fixed_u128';

export const connectedSelector: Selector<boolean> = state => state.chain.connected;

export const pricesFeedSelector: Selector<PriceData[]> = state => state.chain.pricesFeed;

export const vaultsSelector: Selector<BaseVaultData[]> = state => state.chain.vaults;

export const totalIssuanceSelector: Selector<IssuanceData[]> = state => state.chain.totalIssuance;

export const specVaultSelector: (asset: number) => Selector<BaseVaultData | undefined> = asset => {
    return state => {
        return state.chain.vaults.find(item => item.asset === asset);
    };
};

export function specPriceSelector(assets: number): Selector<FixedU128>;
export function specPriceSelector(assets: number[]): Selector<FixedU128[]>;
export function specPriceSelector(assets: number | number[]): Selector<FixedU128[]> | Selector<FixedU128> {
    if (typeof assets === 'number') {
        return state => {
            const result = state.chain.pricesFeed.find(item => item.asset === assets);
            return result ? result.price : FixedU128.fromNatural(0);
        };
    }
    return state => {
        return assets.map(asset => {
            const result = state.chain.pricesFeed.find(item => item.asset === asset);
            return result ? result.price : FixedU128.fromNatural(0);
        });
    };
}
export function specIssuanceSelector(assets: number): Selector<FixedU128>;
export function specIssuanceSelector(assets: number[]): Selector<FixedU128[]>;
export function specIssuanceSelector(assets: number | number[]): Selector<FixedU128 | FixedU128[]> {
    if (typeof assets === 'number') {
        return state => {
            const result = state.chain.totalIssuance.find(item => item.asset === assets);
            return result ? result.issuance : FixedU128.fromNatural(0);
        };
    }
    return state => {
        return assets.map(asset => {
            const result = state.chain.totalIssuance.find(item => item.asset === asset);
            return result ? result.issuance : FixedU128.fromNatural(0);
        });
    };
}
