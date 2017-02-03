import Note from "./Note";
import { createStore } from 'redux';

export type NoteState = {
  notes: Note[],
  currentId: number,
  view: string
};

const DefaultState: NoteState = {
  notes: [],
  currentId: 0,
  view: 'list'
};

const store = createStore(
  (state: NoteState, actions): NoteState => {
    let newState, note;
    switch (actions.type) {
      case 'add':
        const id = state.notes.length;
        newState = Object.assign({}, state, {update: true});
        note = actions.note;
        note.id = id;
        newState.notes.push(note);
        return newState;
      case 'update':
        note = actions.note;
        newState = Object.assign({}, state);
        newState.notes = newState.notes.map(e => {
          if (e.id == note.id) {
            return note;
          }
          return e;
        });
        return newState;

      case 'show-view.list':
        return Object.assign({}, state, {view: 'list', update: true});
      case 'show-view.item':
        const {currentId} = actions;
        return Object.assign({}, state, {view: 'item', update: true, currentId});
      default:
        return state;
    }
  },
  DefaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({/* options */})
);
export default store;

export const NotesAction = {
  add(note) {
    return store.dispatch({type: 'add', note});
  },

  update(note) {
    return store.dispatch({type: 'update', note});
  },

  showItem(id) {
    return store.dispatch({type: 'show-view.item', currentId: id});
  },

  show(screen: 'list' | 'item') {
    return store.dispatch({type: 'show-view.' + screen});
  },
};