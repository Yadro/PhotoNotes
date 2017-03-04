
import { createStore, combineReducers } from 'redux';
import notes, {NoteState} from './notes'
import other, {OtherState} from './other'
import {importNotes} from "./StoreImport";
import {Actions} from "./Actions";

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

importNotes(notes => {
  if (typeof notes == "object" && notes.length) {
    Actions.importNotes(notes);
  }
});

export default store;