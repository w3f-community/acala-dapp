import { combineEpics } from 'redux-observable';
import * as appEpics from './app/epic';
import * as chainEpics from './chain/epic';
import * as userEpics from './user/epic';
import * as vaultEpics from './vault/epic';

export default combineEpics(
    // ...Object.values(appEpics),
    ...Object.values(chainEpics),
    ...Object.values(userEpics),
    ...Object.values(vaultEpics),
);
