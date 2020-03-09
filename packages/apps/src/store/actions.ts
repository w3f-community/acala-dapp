import { startLoading, endLoading } from './loading/reducer';
import * as appActions from './app/actions';
import * as chainActions from './chain/actions';
import * as accountActions from './account/actions';
import * as loanActions from './loan/actions';
import * as dexActions from './dex/actions';
import * as governanceActions from './governance/actions';

export default {
    loading: { startLoading, endLoading },
    app: appActions,
    chain: chainActions,
    account: accountActions,
    loan: loanActions,
    dex: dexActions,
    governance: governanceActions,
};
