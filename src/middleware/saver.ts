import {call, put, select, takeEvery} from 'redux-saga/effects';
import {ADD, REMOVE, UPDATE} from "../constants/ActionTypes";
import {dbxApi} from '../util/DropboxApi';
import {AppStore} from "../redux/IAppStore";
const actions = [UPDATE, REMOVE];

function getNotes(state: AppStore) {
  return state.notes;
}

function* dropBoxSync(action) {
  const notes = yield select(getNotes);

  console.log(notes);
  yield call(dbxApi.synchronizeFromDevice.bind(dbxApi), notes);
}

export default function* rootSaga() {
  yield takeEvery(UPDATE, dropBoxSync);
  yield takeEvery(REMOVE, dropBoxSync);
}