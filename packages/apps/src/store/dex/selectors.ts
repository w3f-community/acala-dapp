import { Selector, TxStatus, DexLiquidityPoolData } from '@honzon-platform/apps/types/store';

type StatusType = 'swapCurrency';

export const statusSelector: (type: StatusType) => Selector<TxStatus> = type => {
    return state => {
        return state.dex[`${type}Status`];
    };
};

export const specDexLiquidatePoolSelector: (asset: number) => Selector<DexLiquidityPoolData | undefined> = asset => {
    return state => {
        return state.dex.dexLiquidityPool.find(item => item.asset === asset);
    };
};
