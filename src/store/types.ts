import { ApiRx } from '@polkadot/api';

export interface PriceData {
    asset: number;
    price: number;
}

export interface ChainState {
    app: ApiRx | null;
    connected: boolean;
    pricesFeed: PriceData[];
}
