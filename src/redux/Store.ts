import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import notes, {NoteState} from './notes';
import other, {OtherState} from './other';
import filter from './filter';

interface MyStore {
  notes: NoteState;
  other: OtherState;
}

const reducers = combineReducers<MyStore>({
  notes,
  other,
  filter,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore<MyStore>(
  reducers,
  composeEnhancers(
    applyMiddleware(thunk),
  )
);

export default store;