import { Selector } from '@/types/store';
import { BalanceData } from '../types';

export const balancesSelector: Selector<{}, BalanceData[]> = state => state.user.balancas;
