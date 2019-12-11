import { startLoading, endLoading } from './loading/reducer';
import * as chainActions from './chain/actions';
import * as userActions from './user/actions';
import * as vaultActions from './vault/actions';

export default {
    loading: { startLoading, endLoading },
    chain: chainActions,
    user: userActions,
    vault: vaultActions,
};
