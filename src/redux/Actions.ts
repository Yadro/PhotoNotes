import store from './Store';
import {exportNotes} from "./StoreImport";
import {setFileName, setSaved} from '../constanse/ActionTypes';

export const Actions = {
  add(note) {
    store.dispatch({type: 'ADD', note, createdAt: Date.now()});
    exportNotes(store.getState().notes);
  },

  update(note) {
    note.saved = false;
    store.dispatch({type: 'UPDATE', note, updatedAt: Date.now()});
    exportNotes(store.getState().notes);
  },

  remove(id) {
    store.dispatch({type: 'REMOVE', id});
    exportNotes(store.getState().notes);
  },

  removes(ids) {
    store.dispatch({type: 'REMOVE_ARR', ids});
    exportNotes(store.getState().notes);
  },

  setFileName(id, fileName) {
    store.dispatch({type: setFileName, id, fileName});
  },

  setSaved(id) {
    store.dispatch({type: setSaved, id});
  },

  importNotes(notes) {
    store.dispatch({type: 'IMPORT', notes});
  },
};


export const ActionOther = {
  setViewSize(size) {
    store.dispatch({type: 'SET_VIEW_SIZE', size});
  },
  setMultiChoose(multi) {
    store.dispatch({type: 'SET_MULTI_CHOOSE', multi});
  }
};