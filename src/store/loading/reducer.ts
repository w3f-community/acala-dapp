import { fromJS } from 'immutable';

export interface LoadingAction {
    type: string;
    payload: null;
}

// actions
export function startLoading(originType: string): LoadingAction {
    return {
        type: `${originType}/loading/start`,
        payload: null,
    };
}

export function endLoading(originType: string): LoadingAction {
    return {
        type: `${originType}/loading/end`,
        payload: null,
    };
}

// selector
export const loadingSelector = (type: string) => (state: any) => {
    return state.loading.get(type);
};

// reducer
const initialState = {};

export default function(state = fromJS(initialState), action: LoadingAction) {
    const startReg = /(.*?)\/loading\/start/;
    const endReg = /(.*?)\/loading\/end/;
    if (startReg.test(action.type)) {
        const originEvent: string = startReg.exec(action.type)![1]; // get origin event
        return state.set(originEvent, true);
    }
    if (endReg.test(action.type)) {
        const originEvent: string = endReg.exec(action.type)![1]; // get origin event
        return state.set(originEvent, false);
    }
    return state;
}
