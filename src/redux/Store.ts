import { createStore, combineReducers } from 'redux';
import notes, {NoteState} from './notes'
import other, {OtherState} from './other'

interface MyStore {
  notes: NoteState;
  other: OtherState;
}

let store = createStore<MyStore>(
  combineReducers<MyStore>({
    notes,
    other
  }),
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({/* options */})
);

export default store;