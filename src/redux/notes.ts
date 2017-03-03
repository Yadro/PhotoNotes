import Note from "../Note";

export type NoteState = Note[];

export const DefaultState: NoteState = [];

export default (state: Note[] = [], actions): NoteState => {
  let newState: Note[], note: Note, id;
  switch (actions.type) {
    case 'ADD':
      id = getMax(state) + 1;
      note = actions.note;
      note.id = id;
      note.createdAt = actions.createdAt;
      return [
        ...state,
        note
      ];
    case 'UPDATE':
      note = actions.note;
      newState = [...state];
      note.updatedAt = actions.updatedAt;
      newState = newState.map(e => {
        if (e.id == note.id) {
          return note;
        }
        return e;
      });
      return newState;

    case 'REMOVE':
      newState = copy(state);
      id = actions.id;
      newState = newState.filter(e => e.id != id);
      return newState;

    case 'REMOVE_ARR':
      newState = copy(state);
      const {ids} = actions;
      newState = newState.filter(e => !ids.includes(e.id));
      return newState;

    case 'IMPORT':
      return actions.notes;

    default:
      return state;
  }
};

function getMax(arr: {id}[]) {
  let max = 0;
  arr.forEach(e => {
    max = Math.max(e.id, max)
  });
  return max;
}

function copy(o) {
  return JSON.parse(JSON.stringify(o));
}