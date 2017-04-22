import {FilterState} from "../reducers/filter";
/**
 * reducers/filter.ts
 * @see FilerType
 */
export const ActionFilter = {
  SET_CURRENT_FILTER: 'SET_CURRENT_FILTER',
  SET_FILTER_COUNT: 'SET_FILTER_COUNT',
  ADD_FILTER: 'ADD_FILTER',
  REMOVE_FILTER: 'REMOVE_FILTER',
  UPDATE_FILTER: 'UPDATE_FILTER',
  SET_STATE_FILTER: 'SET_STATE_FILTER',
  DO_IMPORT_FILTER: 'DO_IMPORT_FILTER',
  DO_EXPORT_FILTER: 'DO_EXPORT_FILTER',

  addFilter(filter) {
    return {type: ActionFilter.ADD_FILTER, filter};
  },

  updateFilter(filter) {
    return {type: ActionFilter.UPDATE_FILTER, filter};
  },

  removeFilter(id) {
    return {type: ActionFilter.REMOVE_FILTER, id};
  },

  setCurrentFilter(id) {
    return {type: ActionFilter.SET_CURRENT_FILTER, current: id};
  },

  setFilter(filters: FilterState) {
    return {type: ActionFilter.SET_STATE_FILTER, filters};
  },

  doImportFilter() {
    return {type: ActionFilter.DO_IMPORT_FILTER};
  },

  doExportFilter() {
    return {type: ActionFilter.DO_EXPORT_FILTER};
  }
};