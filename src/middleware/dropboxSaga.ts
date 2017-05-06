import {call, put, select} from 'redux-saga/effects';
import {dbxApi} from '../util/DropboxNoteApi';
import {AppStore} from "../redux/IAppStore";
import {ActionNote} from "../constants/ActionNote";

function getNotes(state: AppStore) {
  return state.notes;
}

export function* addNoteSync(action) {
  console.log(action.note);
  const fileName = yield call(dbxApi.uploadNewNote.bind(dbxApi), action.note);
  console.log(fileName);
  if (fileName) {
    yield put(ActionNote.setFileName(action.note.id, fileName));
  }
}

export function* updateNoteSync(action) {
  console.log(action.note);
  const saved = yield call(dbxApi.uploadNewNote.bind(dbxApi), action.note);
  console.log(saved);
  yield put(ActionNote.setSaved(action.note.id));
}

export function* dropboxSync() {
  const notes = yield select(getNotes);
  yield call(dbxApi.synchronizeWithCloud.bind(dbxApi), notes);
}
