import {TOGGLE_MULTI, SELECT_ITEM} from "../constants/ActionTypes";
import {set, compose} from 'ramda';
import {lensProp, lensById, over} from "../util/lens";

const multiLens = lensProp('multi');
const selectedLens = lensProp('selected');


export default (state, action) => {
  state = state || {
      multi: false,
      selected: [],
    };

  switch (action.type) {
    case TOGGLE_MULTI:
      let data = over(multiLens, multi => !multi, state);
      data = set(selectedLens, [], data);
      return data;

    case SELECT_ITEM:
      return {
        ...state,
        selected: [
          ...state.selected,
          action.id
        ]
      };
  }

  return state;
}