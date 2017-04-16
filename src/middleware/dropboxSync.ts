import {call, select} from 'redux-saga/effects';
import {dbxApi} from '../util/DropboxApi';
import {AppStore} from "../redux/IAppStore";

function getNotes(state: AppStore) {
  return state.notes;
}

export function* addFileSync(action) {
  console.log(action.note);
  const res = yield call(dbxApi.addNote.bind(dbxApi), action.note);
  console.log(res);
  // yield put(ActionNote.setSaved(action.note.id));
}

export function* dropBoxSync(action) {
  const notes = yield select(getNotes);
  yield call(dbxApi.synchronizeFromDevice.bind(dbxApi), notes);
}
