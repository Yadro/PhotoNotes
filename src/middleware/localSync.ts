import {call, put, select} from 'redux-saga/effects';
import {ActionNote} from "../constants/ActionNote";
import {exportNotes, importNotes} from "../util/FsUtil";
import {AppStore} from "../redux/IAppStore";

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

export function* doExportNotesSaga() {
  yield put(ActionNote.doExportNotes());
}