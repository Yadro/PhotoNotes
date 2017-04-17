import {AppStore} from "../redux/IAppStore";
import {check} from "../util/tagUtil";
import {ActionNote} from "../constants/ActionNote";
import {ActionFilter} from "../constants/ActionFilter";

const ACTIONS = [
  // notes change
  ActionNote.ADD, ActionNote.UPDATE, ActionNote.SET_TAGS, ActionNote.REMOVE, ActionNote.RESTORE, ActionNote.REMOVE_ARR, ActionNote.REMOVE_ANYWAY, ActionNote.REMOVE_ANYWAY_ARR, ActionNote.IMPORT,
  // filter change
  ActionFilter.ADD_FILTER, ActionFilter.UPDATE_FILTER,
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
            next({type: ActionFilter.SET_FILTER_COUNT, id: filter.id, count});
          }
        });
      }
    }
  }
}
