import store from './Store';
import {exportNotes} from "./StoreImport";

export const Actions = {
  add(note) {
    store.dispatch({type: 'ADD', note});
    exportNotes(store.getState().notes);
  },

  update(note) {
    store.dispatch({type: 'UPDATE', note});
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