import {toggleMulti, selectItem} from "../constants/ActionTypes";
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
    case toggleMulti:
      let data = over(multiLens, multi => !multi, state);
      data = set(selectedLens, [], data);
      return data;

    case selectItem:
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