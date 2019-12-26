import { Selector, Tx } from '@/types/store';

export const transactionsSelector: Selector<Tx[]> = state => state.app.transactions;
