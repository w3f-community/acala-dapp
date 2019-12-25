import { Tx } from '../types';
import { Selector } from '@/types/store';

export const transactionsSelector: Selector<Tx[]> = state => state.app.transactions;
