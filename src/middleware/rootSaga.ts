import {takeEvery, takeLatest} from 'redux-saga/effects';
import {ActionNote} from "../constants/ActionNote";
import {addFileSync, dropBoxSync} from "./dropboxSync";
import {doExportNotesSaga, exportNotesSaga, importNotesSaga} from "./localSync";

export function* rootSaga() {
  yield takeEvery(ActionNote.ADD, addFileSync);
  yield takeEvery(ActionNote.UPDATE, dropBoxSync);
  yield takeEvery(ActionNote.REMOVE, dropBoxSync);

  yield takeEvery(ActionNote.DO_IMPORT, importNotesSaga);
  yield takeEvery(ActionNote.DO_EXPORT, exportNotesSaga);

  yield takeLatest([
    ActionNote.ADD, ActionNote.UPDATE, ActionNote.REMOVE
  ], doExportNotesSaga);
}