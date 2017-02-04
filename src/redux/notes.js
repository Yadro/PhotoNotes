import Note from "../Note";

export type NoteState = {
  notes: Note[],
  currentId: number,
  view: string
};

export const DefaultState: NoteState = {
  notes: [],
  currentId: 0,
  view: 'list'
};

export default (state: NoteState = DefaultState, actions): NoteState => {
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
};