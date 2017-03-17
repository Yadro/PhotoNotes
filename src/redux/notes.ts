import Note from "./Note";
import {
  setFileName, setSaved, addNote, updateNote, removeAnyway, removeAnywayArr,
  remove, removeArr, doImport
} from "../constants/ActionTypes";
import {set, compose} from 'ramda';
import {lensProp, lensById, over} from "../util/lens";

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
const lensNoteTags = id => compose(
  lensById(id),
  lensProp('tags')
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

    case remove:
      return state.map(note => {
        if (note.id == actions.id) {
          return over(lensProp('tags'), (tags) => [...tags, 'trash'], note);
        }
        return note;
      });

    case removeArr:
      return state.map(note => {
        if (actions.ids.includes(note.id)) {
          return over(lensProp('tags'), (tags) => [...tags, 'trash'], note);
        }
        return note;
      });

    case removeAnyway:
      return state.filter(e => e.id != actions.id);

    case removeAnywayArr:
      return state.filter(e => !actions.ids.includes(e.id));

    case doImport:
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