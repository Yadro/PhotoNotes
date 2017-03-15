import Note from "../screens/Note";
import {setFileName, setSaved, addNote, updateNote} from "../constants/ActionTypes";
import {set, compose} from 'ramda';
import {lensProp, lensById} from "../util/lens";

export type NoteState = Note[];

const lensCreatedAt = lensProp('createdAt');
const lensUpdatedAt = lensProp('updatedAt');
const lensId = lensProp('id');

const lensNoteFilename = id => compose(
  lensById(id),
  lensProp('fileName')
);
const lensNoteSaved = id => compose(
  lensById(id),
  lensProp('saved')
);

export default (state: Note[] = [], actions): NoteState => {
  let note: Note;
  switch (actions.type) {
    case addNote:
      note = set(lensId, getMax(state) + 1, actions.note);
      note = set(lensCreatedAt, actions.createdAt, note);
      return [
        ...state,
        note
      ];

    case updateNote:
      note = set(lensUpdatedAt, actions.updatedAt, actions.note);
      return set(lensById(actions.note.id), note, state);

    case setFileName:
      return set(lensNoteFilename(actions.id), actions.fileName, state);

    case setSaved:
      return set(lensNoteSaved(actions.id), true, state);

    case 'REMOVE':
      return state.filter(e => e.id != actions.id);

    case 'REMOVE_ARR':
      return state.filter(e => !actions.ids.includes(e.id));

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