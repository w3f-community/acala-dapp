import * as chainActions from './chain/actions';
import { startLoading, endLoading } from './loading/reducer';

export default {
    chain: chainActions,
    loading: { startLoading, endLoading },
}
