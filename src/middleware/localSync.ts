import {call, put, select} from 'redux-saga/effects';
import {ActionNote} from "../constants/ActionNote";
import {exportNotes, importNotes} from "../util/FsUtil";
import {AppStore} from "../redux/IAppStore";
import {ActionFilter} from "../constants/ActionFilter";
import {AsyncStorage} from "react-native";
import {STORE_KEYS} from "../constants/ActionTypes";

export function* importNotesSaga() {
  try {
    const data = yield call(importNotes);
    yield put(ActionNote.importNotes(data));
  } catch (err) {
    console.log(err);
  }
}

export function* exportNotesSaga() {
  try {
    const notes = yield select((state: AppStore) => state.notes);
    yield call(exportNotes, notes);
  } catch (err) {
    console.log(err);
  }
}

export function* exportFilterSaga() {
  try {
    const filters = yield select((state: AppStore) => state.filter);
    AsyncStorage.setItem(STORE_KEYS.tags, filters);
  } catch (err) {
    console.log(err);
  }
}


export function* doExportNotesSaga() {
  yield put(ActionNote.doExportNotes());
}

export function* doExportFilterSaga() {
  yield put(ActionFilter.doExportFilter());
}