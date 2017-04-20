export const ActionNote = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  SET_TAGS: 'SET_TAGS',
  SET_SAVED: 'SET_SAVED',
  SET_FILE_NAME: 'SET_FILE_NAME',
  IMPORT: 'IMPORT',
  DO_IMPORT: 'DO_IMPORT',
  DO_EXPORT: 'DO_EXPORT',
  REMOVE: 'REMOVE',
  REMOVE_ARR: 'REMOVE_ARR',
  RESTORE: 'RESTORE',
  REMOVE_ANYWAY: 'REMOVE_ANYWAY',
  REMOVE_ANYWAY_ARR: 'REMOVE_ANYWAY_ARR',
  
  add(note) {
    return {type: ActionNote.ADD, note};
  },

  update(note) {
    return {type: ActionNote.UPDATE, note};
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

  doImportNotes() {
    return {type: ActionNote.DO_IMPORT};
  },

  doExportNotes() {
    return {type: ActionNote.DO_EXPORT};
  },
};
