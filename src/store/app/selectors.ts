import { RootState } from 'typesafe-actions';
import { Tx } from '../types';
import { Selector } from '@/types/store';

export const transitionsSelector: Selector<Tx[]> = state => state.app.transitions;
