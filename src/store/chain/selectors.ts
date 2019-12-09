import { Selector } from '@/types/store';

export const connectedSelector: Selector<boolean, {}> = state => state.chain.connected;
