import store from './Store';
import {exportNotes} from "./StoreImport";
import {
  setFileName, setSaved, remove, removeArr, removeAnyway, removeAnywayArr,
  restore
} from '../constants/ActionTypes';
import {tracker} from "../Analytics";

export const Actions = {
  add(note) {
    store.dispatch({type: 'ADD', note, createdAt: Date.now()});
    exportNotes(store.getState().notes);
    if (!__DEV__) tracker.trackEvent('Note', 'New');
  },

  update(note) {
    note.saved = false;
    store.dispatch({type: 'UPDATE', note, updatedAt: Date.now()});
    exportNotes(store.getState().notes);
    if (!__DEV__) tracker.trackEvent('Note', 'Update');
  },

  restore(id) {
    store.dispatch({type: restore, id});
    exportNotes(store.getState().notes);
    if (!__DEV__) tracker.trackEvent('Note', 'Restore');
  },

  remove(id) {
    store.dispatch({type: remove, id});
    exportNotes(store.getState().notes);
    if (!__DEV__) tracker.trackEvent('Note', 'Remove');
  },

  removes(ids) {
    store.dispatch({type: removeArr, ids});
    exportNotes(store.getState().notes);
    if (!__DEV__) tracker.trackEvent('Note', 'RemoveArr');
  },

  removeAnyway(id) {
    store.dispatch({type: removeAnyway, id});
    exportNotes(store.getState().notes);
    if (!__DEV__) tracker.trackEvent('Note', 'Delete');
  },

  removesAnyway(ids) {
    store.dispatch({type: removeAnywayArr, ids});
    exportNotes(store.getState().notes);
    if (!__DEV__) tracker.trackEvent('Note', 'DeleteArr');
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