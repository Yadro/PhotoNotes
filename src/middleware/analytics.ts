import {
  ADD, UPDATE, RESTORE, REMOVE, REMOVE_ARR, REMOVE_ANYWAY, REMOVE_ANYWAY_ARR,
  ADD_FILTER, UPDATE_FILTER, REMOVE_FILTER,
} from "../constants/ActionTypes";
import {tracker} from "../Analytics";

const SCREEN_ACTIONS = {
  Note: [ADD, UPDATE, RESTORE, REMOVE, REMOVE_ARR, REMOVE_ANYWAY, REMOVE_ANYWAY_ARR],
  Filter: [ADD_FILTER, UPDATE_FILTER, REMOVE_FILTER],
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