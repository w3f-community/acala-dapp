import { State } from './types';
import { createReducer } from 'typesafe-actions';

const initialState: State = {
    menu: [],
};

export default createReducer(initialState);
