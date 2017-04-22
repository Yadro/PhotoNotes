import {takeEvery, takeLatest} from 'redux-saga/effects';
import {ActionNote} from "../constants/ActionNote";
import {addNoteSync, dropboxSync} from "./dropboxSaga";
import {doExportFilterSaga, doExportNotesSaga, exportNotesSaga, importNotesSaga} from "./localSyncSaga";
import {ActionFilter} from "../constants/ActionFilter";

export function* rootSaga() {
  yield takeEvery(ActionNote.ADD, addNoteSync);
  yield takeEvery(ActionNote.UPDATE, dropboxSync);
  yield takeEvery(ActionNote.REMOVE, dropboxSync);

  yield takeEvery(ActionNote.DO_IMPORT, importNotesSaga);
  yield takeEvery(ActionNote.DO_EXPORT, exportNotesSaga);

  yield takeLatest([
    ActionNote.ADD, ActionNote.UPDATE, ActionNote.REMOVE
  ], doExportNotesSaga);
  yield takeEvery([
    ActionFilter.ADD_FILTER,
    ActionFilter.UPDATE_FILTER,
    ActionFilter.REMOVE_FILTER,
    ActionFilter.SET_CURRENT_FILTER,
  ], doExportFilterSaga);
}