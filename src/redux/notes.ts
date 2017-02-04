import Note from "../Note";

export type NoteState = {
  notes: Note[],
};

export const DefaultState: NoteState = {
  notes: [],
};

export default (state: NoteState = DefaultState, actions): NoteState => {
  let newState, note, id;
  switch (actions.type) {
    case 'ADD':
      id = state.notes.length;
      newState = Object.assign({}, state);
      note = actions.note;
      note.id = id;
      newState.notes.push(note);
      return newState;
    case 'UPDATE':
      note = actions.note;
      newState = Object.assign({}, state);
      newState.notes = newState.notes.map(e => {
        if (e.id == note.id) {
          return note;
        }
        return e;
      });
      return newState;

    case 'REMOVE':
      newState = Object.assign({}, state);
      id = actions.id;
      newState.notes = newState.notes.filter(e => e.id != id);
      return newState;
    case 'IMPORT':
      return Object.assign({}, state, {notes: actions.notes});

    default:
      return state;
  }
};