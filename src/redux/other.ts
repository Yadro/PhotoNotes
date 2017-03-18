import {setSaveFolder} from "../constants/ActionTypes";
import {set, compose, append} from 'ramda';
import {lensProp, lensById, over} from "../util/lens";

export type OtherState = {
  update: boolean;
  size;
  multi: boolean;
  folder: string;
}

export default (state = {update: false, size: null, multi: false}, actions) => {
  switch (actions.type) {
    case 'SET_VIEW_SIZE':
      return set(lensProp('size'), actions.size, state);

    case 'SET_MULTI_CHOOSE':
      return set(lensProp('multi'), actions.multi, state);

    case setSaveFolder:
      return set(lensProp('folder'), actions.folder, state);

  }
  return state;
};