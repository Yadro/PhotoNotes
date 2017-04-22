import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {noteReducer} from '../reducers/notes';
import other from '../reducers/other';
import filter from '../reducers/filter';
import {AppStore} from "./IAppStore";

import {analytics} from "../middleware/analyticsMiddleware";
import {filterCounter} from "../middleware/filterCounterMiddleware";
import {noteMiddleware} from "../middleware/noteMiddleware";

import {rootSaga} from "../middleware/rootSaga";

const reducers = combineReducers<AppStore>({
  notes: noteReducer,
  other,
  filter,
});
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<AppStore>(
  reducers,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(analytics),
    applyMiddleware(filterCounter),
    applyMiddleware(noteMiddleware),
  )
);

sagaMiddleware.run(rootSaga);

export default store;