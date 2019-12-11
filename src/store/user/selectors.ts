import { Selector } from '@/types/store';
import { BalanceData } from '../types';

export const balancesSelector: Selector<BalanceData[]> = state => state.user.balancas;

export const specBalanceSelector: (asset: number) => Selector<number> = asset => {
    return state => {
        const balances = state.user.balancas;
        const result = balances.filter(item => item.asset === asset);

        if (!result.length) return 0;

        return result[0].balance;
    };
};
