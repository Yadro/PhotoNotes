import {tracker} from "../Analytics";
import {ActionNote} from "../constants/ActionNote";
import {ActionFilter} from "../constants/ActionFilter";

const SCREEN_ACTIONS = {
  Note: [ActionNote.ADD, ActionNote.UPDATE, ActionNote.RESTORE, ActionNote.REMOVE, ActionNote.REMOVE_ARR, ActionNote.REMOVE_ANYWAY, ActionNote.REMOVE_ANYWAY_ARR],
  Filter: [ActionFilter.ADD_FILTER, ActionFilter.UPDATE_FILTER, ActionFilter.REMOVE_FILTER],
};

export function analytics({getState}) {
  return (next) => (action) => {
    if (tracker) {
      for (let screen in SCREEN_ACTIONS) {
        const actions = SCREEN_ACTIONS[screen];
        if (actions.indexOf(action.type) !== -1) {
          if (__DEV__) {
            console.info(`ANALYTICS: Screen (${screen}) => event (${action.type})`)
          } else {
            tracker.trackEvent(screen, action.type);
          }
          break;
        }
      }
    }
    return next(action);
  }
}