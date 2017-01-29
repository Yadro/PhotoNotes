import Note from "./Note";

export default class NoteStorage {
  notes = [];

  constructor() {

  }

  add() {
    const note = new Note();
    this.notes.push(note);
  }

  update() {

  }

  remove() {

  }
}