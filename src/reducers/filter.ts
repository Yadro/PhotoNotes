import {set, compose, append, concat} from 'ramda';
import {lensProp, lensById, over} from "../util/lens";
import {getMaxId} from "../util/util";
import {paths} from '../components/Icons';
import {AppStore} from "../redux/IAppStore";
import {ActionFilter} from "../constants/ActionFilter";

const lensId = lensProp('id');
const lensNoteCount= lensProp('noteCount');
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
  noteCount: number;
}
export interface FilterState {
  filters: Filter[];
  current: number;
}

const defaultState: FilterState = {
  filters: [] as Filter[],
  current: -1,
};

export default (state: FilterState, action): FilterState => {
  state = state || defaultState;
  switch (action.type) {
    case ActionFilter.SET_CURRENT_FILTER:
      return set(lensCurrent, action.current, state);

    case ActionFilter.SET_FILTER_COUNT:
      return over(lensFilterByIdx(action.id), filter => {
        return set(lensNoteCount, action.count, filter)
      }, state);

    case ActionFilter.ADD_FILTER:
      return over(lensFilters, filters => {
        return append(
          set(lensId, getMaxId(filters) + 1, action.filter),
          filters
        );
      }, state);

    case ActionFilter.REMOVE_FILTER:
      return over(lensFilters, filters => filters.filter(e => e.id != action.id), state);

    case ActionFilter.UPDATE_FILTER:
      return over(lensFilterByIdx(action.filter.id), () => action.filter, state);

    case ActionFilter.IMPORT_FILTER:
      return action.data.tags || state;
  }
  return state;
}

const systemTags = [{
  id: -1,
  title: 'All',
  type: 'black',
  tags: ['trash'],
  icon: [
    paths.libraryBooksWhite,
    paths.libraryBooksWhite,
  ]
}, {
  id: -2,
  title: 'Trash',
  type: 'white',
  tags: ['trash'],
  icon: [
    paths.deleteIconWhite,
    paths.deleteIconWhite,
  ]
}];

const emptyFilter = {
  id: null,
  title: 'EmptyFilter',
  tags: [],
  type: 'black'
} as Filter;
export function selectCurrentFilter(state: FilterState): Filter {
  const {current, filters} = state;
  return filters.find(e => e.id == current) || emptyFilter;
}

export function selectFilter(state: AppStore): FilterState {
  return over(lensFilters, filters => concat(systemTags, filters), state.filter);
}