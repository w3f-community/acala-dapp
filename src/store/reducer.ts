import { combineReducers } from 'redux';

import loadingReducer from './loading/reducer';
import appReducer from './app/reducer';
import chainReducer from './chain/reducer';
import userReducer from './user/reducer';

export default combineReducers({
    loading: loadingReducer,
    chain: chainReducer,
    app: appReducer,
    user: userReducer,
});
