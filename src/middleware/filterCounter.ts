import {
  ADD, ADD_FILTER, IMPORT, REMOVE, REMOVE_ANYWAY, REMOVE_ANYWAY_ARR, REMOVE_ARR, RESTORE, SET_FILTER_COUNT, SET_TAGS,
  UPDATE, UPDATE_FILTER
} from "../constants/ActionTypes";
import {AppStore} from "../redux/IAppStore";
import {check} from "../util/tagUtil";

const ACTIONS = [
  // notes change
  ADD, UPDATE, SET_TAGS, REMOVE, RESTORE, REMOVE_ARR, REMOVE_ANYWAY, REMOVE_ANYWAY_ARR, IMPORT,
  // filter change
  ADD_FILTER, UPDATE_FILTER
];

export function filterCounter({getState}) {
  return (next) => {
    return function dispatchSetCountNotes(action) {
      next(action);
      const state = getState() as AppStore;
      const {filter: {filters}, notes} = state;
      if (ACTIONS.indexOf(action.type) !== -1) {
        filters.forEach(filter => {
          let checker = check(filter.tags, filter.type === 'white');
          const count = notes.reduce((counter, note) => {
            return counter + (+checker(note.tags));
          }, 0);
          if (filter.noteCount !== count) {
            next({type: SET_FILTER_COUNT, id: filter.id, count});
          }
        });
      }
    }
  }
}
