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

export function* importFilterSaga() {
  try {
    const filter = yield AsyncStorage.getItem(STORE_KEYS.tags);
    yield put(ActionFilter.setFilter(JSON.parse(filter)));
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
    AsyncStorage.setItem(STORE_KEYS.tags, JSON.stringify(filters));
  } catch (err) {
    console.log(err);
  }
}
