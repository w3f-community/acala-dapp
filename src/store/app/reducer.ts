import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
import { AppState } from '@/types/store';

const initialState: AppState = {
    transactions: [],
};

export default createReducer(initialState)
    .handleAction(actions.updateTransition, (state, action) => {
        const data = action.payload;
        const transactions = state.transactions.slice();
        const result = transactions.find(item => item.id === data.id);

        if (result) {
            Object.assign(result, data);
        } else {
            transactions.push(data);
        }

        return Object.assign({}, state, { transactions });
    })
    .handleAction(actions.removeTransition, (state, action) => {
        const id = action.payload;
        const transactions = state.transactions.slice();
        const index = transactions.findIndex(item => item.id === id);

        if (index !== -1) {
            transactions.splice(index, 1);
        }

        return {
            ...state,
            transactions,
        };
    });
