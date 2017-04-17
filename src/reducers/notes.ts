import Note from "../redux/Note";
import {set, compose, append} from 'ramda';
import {lensProp, lensById, over} from "../util/lens";
import {AppStore} from "../redux/IAppStore";
import {check} from "../util/tagUtil";
import {Filter} from "./filter";
import {ActionNote} from "../constants/ActionNote";

export type NoteState = Note[];

const lensCreatedAt = lensProp('createdAt');
const lensUpdatedAt = lensProp('updatedAt');
const lensTags = lensProp('tags');

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
  lensTags
);

export function noteReducer(state: NoteState = [], actions): NoteState {
  let note: Note, newState;
  switch (actions.type) {
    case ActionNote.ADD:
      note = set(lensCreatedAt, actions.createdAt, actions.note);
      return append(note, state);

    case ActionNote.UPDATE:
      note = set(lensUpdatedAt, actions.updatedAt, actions.note);
      return set(lensById(actions.note.id), note, state);

    case ActionNote.SET_TAGS:
      return over(lensNoteTags(actions.id), () => actions.tags, state);

    case ActionNote.SET_FILE_NAME:
      newState = set(lensNoteFilename(actions.id), actions.fileName, state);
      return set(lensNoteSaved(actions.id), true, newState);

    case ActionNote.SET_SAVED:
      return set(lensNoteSaved(actions.id), true, state);

    case ActionNote.RESTORE:
      return over(lensNoteTags(actions.id), tags => tags.filter(tag => tag != 'trash'), state);

    case ActionNote.REMOVE:
      return over(
        lensNoteTags(actions.id),
        tags => Array.from(new Set(append('trash', tags))),
        state
      );

    case ActionNote.REMOVE_ARR:
      return state.map(note => {
        if (actions.ids.includes(note.id)) {
          return over(
            lensTags,
            tags => Array.from(new Set(append('trash', tags))),
            note
          );
        }
        return note;
      });

    case ActionNote.REMOVE_ANYWAY:
      return state.filter(e => e.id != actions.id);

    case ActionNote.REMOVE_ANYWAY_ARR:
      return state.filter(e => !actions.ids.includes(e.id));

    case ActionNote.IMPORT:
      return actions.data || state;

    default:
      return state;
  }
}

export function selectNotesAll(state: AppStore) {
  return state.notes;
}

export function selectNotes(state: AppStore, filter: Filter): NoteState {
  const {notes} = state;
  const isTrash = filter.tags.indexOf('trash') !== -1;
  const isWhite = filter.type === 'white';
  const notesFilter = !isTrash ? notes.filter(n => n.tags.indexOf('trash') === -1) : notes;
  const checker = check(filter.tags, isWhite);
  return notesFilter.filter(n => checker(n.tags));
}