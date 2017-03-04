
import { createStore, combineReducers } from 'redux';
import notes, {DefaultState} from './notes'
import other from './other'
import {importNotes} from "./StoreImport";
import {Actions} from "./Actions";

interface MyStore {
  notes;
  other;
}

let store = createStore<MyStore>(
  combineReducers<MyStore>({
    notes,
    other
  }),
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({/* options */})
);

importNotes(notes => {
  if (typeof notes == "object" && notes.length) {
    Actions.importNotes(notes);
  }
});

export default store;