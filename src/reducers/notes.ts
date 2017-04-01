import Note from "../redux/Note";
import {
  SET_FILE_NAME, SET_SAVED, ADD, UPDATE, REMOVE_ANYWAY, REMOVE_ANYWAY_ARR,
  REMOVE, REMOVE_ARR, IMPORT, RESTORE, SET_TAGS
} from "../constants/ActionTypes";
import {set, view, compose, append} from 'ramda';
import {lensProp, lensById, over} from "../util/lens";
import {getMaxId} from "../util/util";
import {AppStore} from "../redux/IAppStore";
import {check} from "../util/tagUtil";
import {Filter, FilterState} from "./filter";

export type NoteState = Note[];

const lensCreatedAt = lensProp('createdAt');
const lensUpdatedAt = lensProp('updatedAt');
const lensId = lensProp('id');
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

export default (state: Note[] = [], actions): NoteState => {
  let note: Note;
  switch (actions.type) {
    case ADD:
      note = set(lensId, getMaxId(state) + 1, actions.note);
      note = set(lensCreatedAt, actions.createdAt, note);
      return append(note, state);

    case UPDATE:
      note = set(lensUpdatedAt, actions.updatedAt, actions.note);
      return set(lensById(actions.note.id), note, state);

    case SET_TAGS:
      return over(lensNoteTags(actions.id), () => actions.tags, state);

    case SET_FILE_NAME:
      return set(lensNoteFilename(actions.id), actions.fileName, state);

    case SET_SAVED:
      return set(lensNoteSaved(actions.id), true, state);

    case RESTORE:
      return over(lensNoteTags(actions.id), tags => tags.filter(tag => tag != 'trash'), state);

    case REMOVE:
      return over(
        lensNoteTags(actions.id),
        tags => Array.from(new Set(append('trash', tags))),
        state
      );

    case REMOVE_ARR:
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

    case REMOVE_ANYWAY:
      return state.filter(e => e.id != actions.id);

    case REMOVE_ANYWAY_ARR:
      return state.filter(e => !actions.ids.includes(e.id));

    case IMPORT:
      return actions.data.notes || state;

    default:
      return state;
  }
};

export function selectNotesAll(state: AppStore) {
  return state.notes;
}

export function selectNotes(state: AppStore, filterState: FilterState): NoteState {
  const {notes} = state;
  const {filters, current} = filterState;

  const filter = filters.find(e => e.id == current) || {tags: []} as Filter;
  const isTrash = filter.tags.indexOf('trash') !== -1;
  const isWhite = filter.type === 'white';
  const notesFilter = !isTrash ? notes.filter(n => n.tags.indexOf('trash') === -1) : notes;
  const checker = check(filter.tags, isWhite);
  return notesFilter.filter(n => checker(n.tags));
}