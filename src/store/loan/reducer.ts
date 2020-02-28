import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { LoanState } from '@/types/store';

const initialState: LoanState = {
    updateLoanStatus: 'none',
    txRecord: [],
    loans: [],
};

export default createReducer(initialState)
    .handleAction(actions.updateLoan.request, state => ({
        ...state,
        updateLoanStatus: 'pending',
    }))
    .handleAction(actions.updateLoan.success, state => ({
        ...state,
        updateLoanStatus: 'success',
    }))
    .handleAction(actions.updateLoan.failure, state => ({
        ...state,
        updateLoanStatus: 'none',
    }))
    .handleAction(actions.reset, state => ({
        ...state,
        updateLoanStatus: 'none',
    }))
    .handleAction(actions.fetchLoans.success, (state, action) => ({
        ...state,
        loans: action.payload,
    }));
