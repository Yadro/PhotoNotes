import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import notes from '../reducers/notes';
import other from '../reducers/other';
import filter from '../reducers/filter';
import {AppStore} from "./IAppStore";
import {analytics} from "../middleware/analytics";
import {filterCounter} from "../middleware/filterCounter";

const reducers = combineReducers<AppStore>({
  notes,
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
    applyMiddleware(filterCounter)
  )
);

// sagaMiddleware.run(helloSaga);

export default store;