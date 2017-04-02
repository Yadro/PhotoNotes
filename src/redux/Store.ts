import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import notes from '../reducers/notes';
import other from '../reducers/other';
import filter from '../reducers/filter';
import {AppStore} from "./IAppStore";
import {analytics} from "../reducers/analytics";

const reducers = combineReducers<AppStore>({
  notes,
  other,
  filter,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<AppStore>(
  reducers,
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(analytics)
  )
);

export default store;