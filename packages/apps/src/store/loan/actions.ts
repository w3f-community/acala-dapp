import { createAsyncAction, createAction } from 'typesafe-actions';
import { UpdateLoanData, AssetList, UserLoanData } from '@honzon-platform/apps/types/store';

export const UPDATE_VAULT = '@loan/update_loan';
export const updateLoan = createAsyncAction(UPDATE_VAULT, '@loan/update_loan/success', '@loan/update_loan/failure')<
    UpdateLoanData,
    any,
    string
>();

export const reset = createAction('@loan/reset');

export const LOAD_TX_RECORD = '@loan/load_tx_record';
export const loadTxRecord = createAction(LOAD_TX_RECORD);

export const FETCH_VAULTS = '@account/fetch_loans';
export const fetchLoans = createAsyncAction(
    FETCH_VAULTS,
    '@account/fetch_loans/success',
    '@account/fetch_loans/failure',
)<AssetList, UserLoanData[], string>();
