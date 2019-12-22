import { combineEpics } from 'redux-observable';
import * as appEpics from './app/epic';
import * as chainEpics from './chain/epic';
import * as accountEpics from './account/epic';
import * as vaultEpics from './vault/epic';
import * as dexEpics from './dex/epic';

export default combineEpics(
    ...Object.values(appEpics),
    ...Object.values(chainEpics),
    ...Object.values(accountEpics),
    ...Object.values(vaultEpics),
    ...Object.values(dexEpics),
);
