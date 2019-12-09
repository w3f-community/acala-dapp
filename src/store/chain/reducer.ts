import { ChainState } from './types';
import { createReducer } from 'typesafe-actions';
import * as actions from './actions';

const initialState: ChainState = {
    app: null,
    connected: false,
};

export default createReducer(initialState).handleAction(actions.connectAsync.success, (state, action) => {
    return Object.assign(state, {
        app: action.payload,
        connected: true,
    });
});
