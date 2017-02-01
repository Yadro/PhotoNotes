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
        newState.notes.push(new Note(id, actions.title));
        return newState;
      /*case 'set-id':
        return Object.assign({}, state, {currentId: actions.id});*/
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

  showItem(id) {
    return store.dispatch({type: 'show-view.item', currentId: id});
  },

  show(screen: 'list' | 'item') {
    return store.dispatch({type: 'show-view.' + screen});
  },
};