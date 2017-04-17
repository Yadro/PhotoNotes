import {takeEvery, takeLatest} from 'redux-saga/effects';
import {ActionNote} from "../constants/ActionNote";
import {addNoteSync, dropboxSync} from "./dropboxSync";
import {doExportNotesSaga, exportNotesSaga, importNotesSaga} from "./localSync";

export function* rootSaga() {
  yield takeEvery(ActionNote.ADD, addNoteSync);
  yield takeEvery(ActionNote.UPDATE, dropboxSync);
  yield takeEvery(ActionNote.REMOVE, dropboxSync);

  yield takeEvery(ActionNote.DO_IMPORT, importNotesSaga);
  yield takeEvery(ActionNote.DO_EXPORT, exportNotesSaga);

  yield takeLatest([
    ActionNote.ADD, ActionNote.UPDATE, ActionNote.REMOVE
  ], doExportNotesSaga);
}