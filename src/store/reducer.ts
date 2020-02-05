import { combineReducers } from 'redux';

import loadingReducer from './loading/reducer';
import appReducer from './app/reducer';
import chainReducer from './chain/reducer';
import accountReducer from './account/reducer';
import vaultReducer from './vault/reducer';
import dexReducer from './dex/reducer';
import governanceReducer from './governance/reducer';

export default combineReducers({
    loading: loadingReducer,
    chain: chainReducer,
    app: appReducer,
    account: accountReducer,
    vault: vaultReducer,
    dex: dexReducer,
    governance: governanceReducer,
});
