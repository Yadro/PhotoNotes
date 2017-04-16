// todo remove file


import store from './Store';
import {exportNotes, removeFile} from "./StoreImport";
import {
  SET_FILE_NAME, SET_SAVED, REMOVE, REMOVE_ARR, REMOVE_ANYWAY, REMOVE_ANYWAY_ARR,
  RESTORE, SET_SAVE_FOLDER, IMPORT, ADD_FILTER, UPDATE_FILTER, STORE_KEYS, SET_CURRENT_FILTER, REMOVE_FILTER, ADD,
  UPDATE, SET_VIEW_SIZE, SET_MULTI_CHOOSE
} from '../constants/ActionTypes';
import {AsyncStorage} from "react-native";
import Note from "./Note";

export const Actions = {
  add(note) {
    store.dispatch({type: ADD, note, createdAt: Date.now()});
    exportNotes(store.getState().notes);
  },

  update(note) {
    note.saved = false;
    store.dispatch({type: UPDATE, note, updatedAt: Date.now()});
    exportNotes(store.getState().notes);
  },

  restore(id) {
    store.dispatch({type: RESTORE, id});
    exportNotes(store.getState().notes);
  },

  remove(id) {
    const {notes} = store.getState();
    const note = notes.find(e => e.id == id) as Note;
    if (note.tags.indexOf('trash') != -1) {
      this.removeAnyway(id);
      removeFile(note.fileName);
      return;
    }

    store.dispatch({type: REMOVE, id});
    exportNotes(store.getState().notes);
  },

  removes(ids) {
    store.dispatch({type: REMOVE_ARR, ids});
    exportNotes(store.getState().notes);
  },

  removeAnyway(id) {
    store.dispatch({type: REMOVE_ANYWAY, id});
    exportNotes(store.getState().notes);
  },

  removesAnyway(ids) {
    store.dispatch({type: REMOVE_ANYWAY_ARR, ids});
    exportNotes(store.getState().notes);
  },

  setFileName(id, fileName) {
    store.dispatch({type: SET_FILE_NAME, id, fileName});
  },

  setSaved(id) {
    store.dispatch({type: SET_SAVED, id});
  },

  importNotes(data) {
    store.dispatch({type: IMPORT, data});
  },

  addFilter(filter) {
    store.dispatch({type: ADD_FILTER, filter});
    AsyncStorage.setItem(STORE_KEYS.tags, JSON.stringify(store.getState().filter));
  },

  updateFilter(filter) {
    store.dispatch({type: UPDATE_FILTER, filter});
    AsyncStorage.setItem(STORE_KEYS.tags, JSON.stringify(store.getState().filter));
  },

  removeFilter(id) {
    store.dispatch({type: REMOVE_FILTER, id});
    AsyncStorage.setItem(STORE_KEYS.tags, JSON.stringify(store.getState().filter));
  },

  setCurrentFilter(id) {
    store.dispatch({type: SET_CURRENT_FILTER, current: id});

    clearTimeout(timer);
    timer = setTimeout(() => {
      AsyncStorage.setItem(STORE_KEYS.tags, JSON.stringify(store.getState().filter));
    }, 1000);
  }
};
let timer;

export const ActionOther = {
  setViewSize(size) {
    store.dispatch({type: SET_VIEW_SIZE, size});
  },
  setMultiChoose(multi) {
    store.dispatch({type: SET_MULTI_CHOOSE, multi});
  },
  setSaveFolder(folder) {
    store.dispatch({type: SET_SAVE_FOLDER, folder});
    AsyncStorage.setItem(STORE_KEYS.folder, folder);
  }
};