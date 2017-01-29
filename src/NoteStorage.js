import Note from "./Note";

export default class NoteStorage {
  currentId;
  notes: Note[] = [];
  update;

  constructor(update) {
    this.update = update;
  }

  gets() {
    return this.notes;
  }

  getNote(id) {
    return this.notes.find(e => e.id == id);
  }

  select(id) {
    this.currentId = id;
    this.update();
  }

  add(title) {
    let notes = this.notes;
    const note = new Note(notes.length, 'title');
    notes.push(note);
    // this.update();
  }


  remove() {
    this.update();
  }
}