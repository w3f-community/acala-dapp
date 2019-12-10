import { createStore, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import * as chainEpics from './chain/epic';
import * as userEpics from './user/epic';
import rootReducer from './reducer';
import { RootAction, RootState } from 'typesafe-actions';

export default function create() {
    const rootEpic = combineEpics(...Object.values(chainEpics), ...Object.values(userEpics));
    const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        rootReducer,
        composeEnhancers(
            applyMiddleware(
                epicMiddleware, // redux-observable
            ),
        ),
    );

    epicMiddleware.run(rootEpic);
    return store;
}
