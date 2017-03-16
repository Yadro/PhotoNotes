import Note from "./Note";
import {transliterate} from "../util/transliterate";
import {Actions} from "./Actions";
import store from "./Store";
const fs = require('react-native-fs');

const path = fs.DocumentDirectoryPath + '/data.json';
const externalPath = fs.ExternalDirectoryPath;
console.log(externalPath);

export function exportNotes(notes: Note[]) {
  const promises = notes.map(n => {
    return writeFileNote(n);
  });
  Promise.all(promises).then(e => {
    writeFile(path, JSON.stringify(store.getState().notes));
  });
}

export function importNotes(callback) {
  fs.exists(path)
    .then(() => {
      return fs.readFile(path, 'utf8');
    })
    .then((contents) => {
      contents = JSON.parse(contents);
      if (Array.isArray(contents)) {
        contents = contents.map(e => Note.createInstanse(e));
      }
      callback(contents);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
}

function writeFileNote(note: Note) {
  if (note.saved) {
    return false;
  }
  let fileName;
  return createName(note, note.fileName)
    .then(name => {
      fileName = name;
      if (!note.fileName) {
        Actions.setFileName(note.id, fileName);
      }
      return fs.writeFile(genPath(fileName), note.title + '\n' + note.content, 'utf8')
    }).then(e => {
      Actions.setSaved(note.id);
      return true;
    }).catch(e => {
      console.log('fail to save file note', e);
      console.error(e);
      return note.id;
    });
}

function createName(note: Note, name) {
  if (name) {
    return new Promise(resolve => resolve(name));
  }
  let fileName = transliterate(note.title.toLowerCase());
  return fs.exists(genPath(fileName))
    .then(exists => {
      if (!exists) {
        return fileName;
      }
      fileName = `${fileName}_${note.createdAt}`;
      return fs.exists(genPath(fileName)).then(exists => {
        if (!exists) {
          return fileName;
        }
        throw new Error(`File ${genPath(fileName)} exist`);
      });
    });
}

function genPath(name) {
  return externalPath + '/' + name + '.md';
}

function writeFile(path, data) {
  fs.writeFile(path, data, 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });
}