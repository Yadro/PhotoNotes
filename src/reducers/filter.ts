import {set, compose, append, concat} from 'ramda';
import {lensProp, lensById, over, lensByIndex} from "../util/lens";
import {ADD_FILTER, UPDATE_FILTER, REMOVE_FILTER, SET_CURRENT_FILTER, IMPORT} from "../constants/ActionTypes";
import {getMaxId} from "../util/util";

const lensId = lensProp('id');
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
        return append(
          set(lensId, getMaxId(filters) + 1, action.filter),
          filters
        );
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

const systemTags = [{
  id: -1,
  title: 'All',
  type: 'black',
  tags: ['trash']
}, {
  id: -2,
  title: 'Trash',
  type: 'white',
  tags: ['trash']
}];

export function selectFilter(state): FilterState {
  return over(lensFilters, filters => concat(systemTags, filters), state.filter);
}