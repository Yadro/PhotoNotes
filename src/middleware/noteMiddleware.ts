import {ActionNote} from "../constants/ActionNote";

export function noteMiddleware() {
  return (next) => (action) => {
    if (action.type === ActionNote.ADD) {
      const {note} = action;
      note.saved = false;
      note.createdAt = Date.now();
    }
    if (action.type === ActionNote.UPDATE) {
      const {note} = action;
      note.saved = false;
      note.updatedAt = Date.now();
    }
    return next(action);
  }
}