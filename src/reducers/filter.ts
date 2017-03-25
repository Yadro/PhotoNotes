import {set, compose, append} from 'ramda';
import {lensProp, lensById, over, lensByIndex} from "../util/lens";
import {ADD_FILTER, UPDATE_FILTER, REMOVE_FILTER, SET_CURRENT_FILTER, IMPORT} from "../constants/ActionTypes";

const lensCurrent = lensProp('current');
const lensFilters = lensProp('filters');
const lensFilterByIdx = (id) => compose(
  lensFilters,
  lensById(id)
);

export type FilerType = 'white' | 'black';
export interface Filter {
  id: number;
  title: string;
  tags: string[];
  type: FilerType;
}
export interface FilterState {
  filters: Filter[],
  current: number;
}

const defaultState: FilterState = {
  filters: [] as Filter[],
  current: 0,
};

export default (state, action) => {
  state = state || defaultState;
  switch (action.type) {
    case SET_CURRENT_FILTER:
      return set(lensCurrent, action.current, state);
    case ADD_FILTER:
      return over(lensFilters, filters => {
        action.filter.id = filters.length;
        return append(action.filter, filters);
      }, state);
    case REMOVE_FILTER:
      return over(lensFilters, filters => filters.filter(e => e.id != action.id), state);
    case UPDATE_FILTER:
      return over(lensFilterByIdx(action.id), () => action.filter, state);
    case IMPORT:
      return action.data.tags || state;
  }
  return state;
}