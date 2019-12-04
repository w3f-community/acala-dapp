import { ChainState } from './types';
import { fromJS } from 'immutable';
import { createReducer } from 'typesafe-actions';
import * as actions from './actions';

const initialState: ChainState = {
    app: null,
    version: '',
};

export default createReducer(fromJS(initialState)).handleAction(actions.connectAsync.success, (state, action) => {
    return state.set('app', action.payload);
});
