import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { Tx } from '../types';

export interface AppState {
    transitions: Tx[];
}

const initialState: AppState = {
    transitions: [],
};

export default createReducer(initialState)
    .handleAction(actions.updateTransition, (state, action) => {
        const data = action.payload;
        const transitions = state.transitions.slice();
        const result = transitions.find(item => item.hash === data.hash);

        if (result) {
            Object.assign(result, data);
        } else {
            transitions.push(data);
        }

        return Object.assign({}, state, { transitions });
    })
    .handleAction(actions.removeTransition, (state, action) => {
        const hash = action.payload;
        const transitions = state.transitions.slice();
        const index = transitions.findIndex(item => item.hash === hash);

        if (index !== -1) {
            transitions.splice(index, 1);
        }

        return {
            ...state,
            transitions,
        };
    });
