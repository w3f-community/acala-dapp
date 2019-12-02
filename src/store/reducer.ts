import loadingReducer from './loading/reducer';
import appReducer from './app/reducer';
import chainReducer from './chain/reducer';
import { combineReducers } from 'redux';

export default combineReducers({
    loading: loadingReducer,
    chain: chainReducer,
    app: appReducer,
})
