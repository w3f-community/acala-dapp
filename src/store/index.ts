import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducer';
import { RootAction, RootState } from 'typesafe-actions';
import rootEpic from './epic';

export default function create() {
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
