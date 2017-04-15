import {takeEvery} from 'redux-saga';
import {ADD, REMOVE, UPDATE} from "../constants/ActionTypes";

const actions = [ADD, REMOVE, UPDATE];
const needUpdate = (action) => actions.indexOf(action) !== -1;

function* dropboxSync(action) {
  yield* takeEvery()
}

export default function* rootSaga() {
  yield [

  ]
}