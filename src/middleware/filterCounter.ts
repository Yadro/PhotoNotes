
import {
  ADD, IMPORT, REMOVE, REMOVE_ANYWAY, REMOVE_ANYWAY_ARR, REMOVE_ARR, RESTORE, SET_FILTER_COUNT, SET_TAGS,
  UPDATE
} from "../constants/ActionTypes";
import {AppStore} from "../redux/IAppStore";
import {check} from "../util/tagUtil";

const ACTIONS = [
  ADD, /*UPDATE, SET_TAGS, REMOVE, RESTORE, REMOVE_ARR, REMOVE_ANYWAY, REMOVE_ANYWAY_ARR, IMPORT*/
];

export function filterCounter({getState}) {
  return (next) =>
    function dispatchSetCountNotes(action) {
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