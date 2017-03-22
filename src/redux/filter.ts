import {set, compose, append} from 'ramda';
import {lensProp, lensById, over} from "../util/lens";
import {ADD_FILTER, UPDATE_FILTER, REMOVE_FILTER} from "../constants/ActionTypes";

const lensFilters = lensProp('filters');
const lensFilterById = (id) => compose(
  lensFilters,
  lensById(id)
);

interface Filter {
  title: string;
  whiteList?: string[];
  blackList?: string[];
}

const defaultState = {
  filters: [] as Filter[]
};

export default (state, actions) => {
  state = state || defaultState;
  switch (actions.type) {
    case ADD_FILTER:
      return over(lensFilters, filters => append(filters, actions.filter), state);
    case REMOVE_FILTER:
      return over(lensFilters, filters => filters.filter(e => e.id != actions.id), state);
    case UPDATE_FILTER:
      return over(lensFilterById(actions.id), actions.filter, state);
  }
  return state;
}