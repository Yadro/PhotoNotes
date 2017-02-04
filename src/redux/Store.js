
import { createStore, combineReducers } from 'redux';
import notes, {DefaultState} from './notes'
import other from './other'


let store = createStore(
  combineReducers({
    notes,
    other
  }),
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({/* options */})
);


export default store;