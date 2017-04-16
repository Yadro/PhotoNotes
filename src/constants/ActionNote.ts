export const ActionNote = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  SET_TAGS: 'SET_TAGS',
  SET_SAVED: 'SET_SAVED',
  SET_FILE_NAME: 'SET_FILE_NAME',
  IMPORT: 'IMPORT',
  REMOVE: 'REMOVE',
  REMOVE_ARR: 'REMOVE_ARR',
  RESTORE: 'RESTORE',
  REMOVE_ANYWAY: 'REMOVE_ANYWAY',
  REMOVE_ANYWAY_ARR: 'REMOVE_ANYWAY_ARR',
  
  add(note) {
    return {type: ActionNote.ADD, note, createdAt: Date.now()};
  },

  update(note) {
    note.saved = false;
    return {type: ActionNote.UPDATE, note, updatedAt: Date.now()};
  },

  restore(id) {
    return {type: ActionNote.RESTORE, id};
  },

  remove(id) {
    return {type: ActionNote.REMOVE, id};
  },

  removes(ids) {
    return {type: ActionNote.REMOVE_ARR, ids};
  },

  removeAnyway(id) {
    return {type: ActionNote.REMOVE_ANYWAY, id};
  },

  removesAnyway(ids) {
    return {type: ActionNote.REMOVE_ANYWAY_ARR, ids};
  },

  setFileName(id, fileName) {
    return {type: ActionNote.SET_FILE_NAME, id, fileName};
  },

  setSaved(id) {
    return {type: ActionNote.SET_SAVED, id};
  },

  importNotes(data) {
    return {type: ActionNote.IMPORT, data};
  },
};
