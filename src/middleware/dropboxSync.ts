import {call, put, select, takeEvery} from 'redux-saga/effects';
import {ADD, REMOVE, UPDATE} from "../constants/ActionTypes";
import {dbxApi} from '../util/DropboxApi';
import {AppStore} from "../redux/IAppStore";
import {ActionNote} from "../constants/ActionNote";
const actions = [UPDATE, REMOVE];

function getNotes(state: AppStore) {
  return state.notes;
}

function* addFileSync(action) {
  console.log(action.note);
  const res = yield call(dbxApi.addNote.bind(dbxApi), action.note);
  console.log(res);
  // yield put(ActionNote.setSaved(action.note.id));
}

function* dropBoxSync(action) {
  const notes = yield select(getNotes);
  yield call(dbxApi.synchronizeFromDevice.bind(dbxApi), notes);
}

export default function* rootSaga() {
  /*yield takeEvery(ADD, addFileSync);
  yield takeEvery(UPDATE, dropBoxSync);
  yield takeEvery(REMOVE, dropBoxSync);*/
}