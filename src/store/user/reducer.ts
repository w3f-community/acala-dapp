import { createReducer } from 'typesafe-actions';
import { UserState } from '../types';
import * as actions from './actions';

const initialState: UserState = {
    account: '5F98oWfz2r5rcRVnP9VCndg33DAAsky3iuoBSpaPUbgN9AJn',
    balancas: [],
};

export default createReducer(initialState).handleAction(actions.fetchAssetsBalance.success, (state, action) => ({
    ...state,
    balancas: action.payload,
}));
