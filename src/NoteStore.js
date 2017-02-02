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
  (state: NoteState = DefaultState, actions): NoteState => {
    let newState;
    switch (actions.type) {
      case 'add':
        const id = state.notes.length;
        newState = Object.assign({}, state, {update: true});
        const {title, content, image} = actions;
        newState.notes.push(new Note(id, title, content, image));
        return newState;
      case 'update':
        const {note} = actions;
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
  }
);
export default store;

export const NotesAction = {
  add(title) {
    return store.dispatch({type: 'add', title});
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