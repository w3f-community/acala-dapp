import { AppState } from './types';
import { fromJS } from 'immutable';
import { createReducer } from 'typesafe-actions';

const initialState: AppState = {
    menu: [
        {
            name: 'CDP',
            icon: 'solution',
        }
    ],
    icon: '',
};

export default createReducer(fromJS(initialState));