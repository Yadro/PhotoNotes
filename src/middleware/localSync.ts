import {call, put} from 'redux-saga/effects';
import {ActionNote} from "../constants/ActionNote";
import {importNotes} from "../util/FsUtil";

export function* importNotesSaga(action) {
  try {
    const data = yield call(importNotes);
    yield put(ActionNote.importNotes(data));
  } catch (err) {
    console.log(err);
  }
}