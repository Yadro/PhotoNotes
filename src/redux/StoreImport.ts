import {AsyncStorage} from 'react-native'
import Note from "./Note";
import {transliterate} from "../util/transliterate";
import {Actions} from "./Actions";
import store from "./Store";
import {SET_SAVE_FOLDER, STORE_KEYS} from "../constants/ActionTypes";
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

export function importNotes() {
  const tp = AsyncStorage.getItem(STORE_KEYS.tags).then(e => {
    if (e == null) return;
    return JSON.parse(e);
  });
  const np = getPathToSave()
    .then(path => fs.exists(path))
    .then(() => fs.readFile(path, 'utf8'))
    .then(contents => {
      contents = JSON.parse(contents);
      if (!Array.isArray(contents)) {
        return Promise.resolve(contents);
      }
      return Promise.all(contents.map(e => {
        const note = Note.createInstance(e);
        if (!note.fileName) {
          return Promise.resolve(note);
        }
        const path = genPath(note.fileName);
        return fs.exists(path)
          .then(exists => {
            if (!exists) throw new Error(`File '${path}' not found`);
            return fs.readFile(path, 'utf8');
          })
          .then(content => {
            const data = parseNoteContent(content);
            note.title = data.title;
            note.content = data.content;
            return note;
          })
          .catch(e => {
            note.tags.push('trash');
            return note;
          });
      }));
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  return new Promise((resolve, reject) => {
    Promise.all([tp, np]).then(e => {
      resolve({
        tags: e[0],
        notes: e[1],
      });
    });
  });
}

function getPathToSave() {
  const {other} = store.getState();
  if (other.folder) {
    return Promise.resolve(other.folder);
  }
  return AsyncStorage.getItem(STORE_KEYS.folder)
    .then(value => {
      if (!value) throw new Error('value = null');
      console.log(value);
      store.dispatch({type: SET_SAVE_FOLDER, folder: value});
      return value;
    })
    .catch(e => {
      store.dispatch({type: SET_SAVE_FOLDER, folder: externalPath});
      return externalPath;
    });
}

function parseNoteContent(text: string) {
  const delim = text.search('\n');
  return {
    title: text.substr(0, delim),
    content: text.substr(delim + 1),
  };
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