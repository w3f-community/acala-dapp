import { Selector } from '@/types/store';
import { PriceData } from '../types';

export const connectedSelector: Selector<boolean, {}> = state => state.chain.connected;

export const pricesFeedSelector: Selector<PriceData[], {}> = state => state.chain.pricesFeed;
