import { Selector, PriceData, CdpTypeData, IssuanceData } from '@/types/store';
import FixedU128 from '@/utils/fixed_u128';

export const connectedSelector: Selector<boolean> = state => state.chain.connected;

export const pricesFeedSelector: Selector<PriceData[]> = state => state.chain.pricesFeed;

export const totalIssuanceSelector: Selector<IssuanceData[]> = state => state.chain.totalIssuance;

export const cdpTypeSelector: Selector<CdpTypeData[]> = state => state.chain.cdpTypes;

export const specCdpTypeSelector: (asset: number) => Selector<CdpTypeData | undefined> = asset => {
    return state => {
        return state.chain.cdpTypes.find(item => item.asset === asset);
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
