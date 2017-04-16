import {takeEvery} from 'redux-saga/effects';
import {ActionNote} from "../constants/ActionNote";
import {addFileSync, dropBoxSync} from "./dropboxSync";
import {importNotesSaga} from "./localSync";


export function* rootSaga() {
  yield takeEvery(ActionNote.ADD, addFileSync);
  yield takeEvery(ActionNote.UPDATE, dropBoxSync);
  yield takeEvery(ActionNote.REMOVE, dropBoxSync);

  yield takeEvery(ActionNote.DO_IMPORT, importNotesSaga);
  // yield takeEvery('@@INIT', importNotesSaga);
}