import { Menu } from './types';
import { RootState } from 'typesafe-actions';

export function menuSelector(state: RootState): Menu[] {
    return state.app.menu;
}
