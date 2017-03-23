import ReduxThunk from 'redux-thunk';
import store from './Store';
import {exportNotes} from "./StoreImport";
import {
  setFileName, setSaved, remove, removeArr, removeAnyway, removeAnywayArr,
  restore, SET_SAVE_FOLDER, doImport, ADD_FILTER, UPDATE_FILTER
} from '../constants/ActionTypes';
import {tracker} from "../Analytics";
import {AsyncStorage} from "react-native";

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

  importNotes(data) {
    store.dispatch({type: doImport, data});
  },

  addFilter(filter) {
    store.dispatch({type: ADD_FILTER, filter});
    AsyncStorage.setItem('@Store:tags', JSON.stringify(store.getState().filter));
  },

  updateFilter(id, filter) {
    store.dispatch({type: UPDATE_FILTER, id, filter});
    AsyncStorage.setItem('@Store:tags', JSON.stringify(store.getState().filter));
  },
};


export const ActionOther = {
  setViewSize(size) {
    store.dispatch({type: 'SET_VIEW_SIZE', size});
  },
  setMultiChoose(multi) {
    store.dispatch({type: 'SET_MULTI_CHOOSE', multi});
  },
  setSaveFolder(multi) {
    store.dispatch({type: SET_SAVE_FOLDER, multi});
  }
};