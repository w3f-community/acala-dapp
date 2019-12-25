import { Selector } from '@/types/store';
import { TxStatus, DexLiquidityPoolData } from '../types';

type StatusType = 'swapCurrency';

export const statusSelector: (type: StatusType) => Selector<TxStatus> = type => {
    return state => {
        return state.vault[`${type}Status`];
    };
};

export const specDexLiquidatePoolSelector: (asset: number) => Selector<DexLiquidityPoolData | undefined> = asset => {
    return state => {
        return state.dex.dexLiquidityPool.find(item => item.asset === asset);
    };
};
